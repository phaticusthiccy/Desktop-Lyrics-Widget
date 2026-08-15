const { exec } = require('child_process');
const path = require('path');
const EventEmitter = require('events');

function getScriptPath(scriptName) {
  const p = path.join(__dirname, '..', 'scripts', scriptName);
  return p.replace('app.asar', 'app.asar.unpacked');
}

class MediaListener extends EventEmitter {
  constructor() {
    super();
    this.currentTrack = null;
    this.currentPosition = 0;
    this.currentDuration = 0;
    this.playbackStatus = 'Stopped';
    this.isPolling = false;
    this.pollInterval = null;
    this.scriptPath = getScriptPath('get-media.ps1');
  }

  startPolling(intervalMs = 800) {
    if (this.isPolling) return;
    this.isPolling = true;

    this.pollInterval = setInterval(() => {
      this.queryWindowsSMTC();
    }, intervalMs);

    // Initial query
    this.queryWindowsSMTC();
  }

  stopPolling() {
    this.isPolling = false;
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  queryWindowsSMTC() {
    const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${this.scriptPath}"`;
    exec(cmd, { timeout: 2000, encoding: 'utf8' }, (error, stdout) => {
      if (error || !stdout) {
        return;
      }
      try {
        const raw = stdout.trim();
        if (!raw || raw === '{}') {
          if (this.currentTrack) {
            this.currentTrack = null;
            this.playbackStatus = 'Stopped';
            this.emit('trackChange', {
              track: { title: '', artist: '', app: '' },
              position: 0,
              duration: 0,
              status: 'Stopped'
            });
          }
          return;
        }

        const data = JSON.parse(raw);
        if (!data || !data.title) {
          if (this.currentTrack) {
            this.currentTrack = null;
            this.playbackStatus = 'Stopped';
            this.emit('trackChange', {
              track: { title: '', artist: '', app: '' },
              position: 0,
              duration: 0,
              status: 'Stopped'
            });
          }
          return;
        }

        const isNewTrack = !this.currentTrack || 
          this.currentTrack.title !== data.title || 
          this.currentTrack.artist !== data.artist;

        this.currentPosition = data.position || 0;
        this.currentDuration = data.duration || 0;
        this.playbackStatus = data.status || 'Playing';

        if (isNewTrack) {
          this.currentTrack = {
            title: data.title,
            artist: data.artist,
            app: data.app || 'Media Player',
            duration: data.duration || 0
          };
          this.emit('trackChange', {
            track: this.currentTrack,
            position: this.currentPosition,
            duration: this.currentDuration,
            status: this.playbackStatus
          });
        } else {
          this.emit('positionUpdate', {
            position: this.currentPosition,
            duration: this.currentDuration,
            status: this.playbackStatus
          });
        }
      } catch (e) {
        // Parsing or JSON error ignored
      }
    });
  }

  seek(positionSeconds) {
    this.currentPosition = Math.max(0, positionSeconds);
    this.emit('positionUpdate', {
      position: this.currentPosition,
      duration: this.currentDuration,
      status: this.playbackStatus
    });
  }

  controlMedia(action) {
    const script = getScriptPath('control-media.ps1');
    const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${script}" -action "${action}"`;
    exec(cmd, { timeout: 2500 }, () => {
      // Small 150ms buffer for Windows SMTC state to update, then fetch real status from Windows
      setTimeout(() => {
        this.queryWindowsSMTC();
      }, 150);
    });
  }
}

module.exports = MediaListener;
