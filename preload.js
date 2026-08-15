const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Event Listeners from Main
  onMediaChange: (callback) => {
    ipcRenderer.on('media-changed', (event, data) => callback(data));
  },
  onPositionUpdate: (callback) => {
    ipcRenderer.on('position-updated', (event, data) => callback(data));
  },
  onClickThroughState: (callback) => {
    ipcRenderer.on('click-through-state', (event, state) => callback(state));
  },
  onAutoStartChange: (callback) => {
    ipcRenderer.on('autostart-state-changed', (event, state) => callback(state));
  },

  // Actions sent to Main
  fetchLyrics: (artist, title, duration) => ipcRenderer.invoke('fetch-lyrics', { artist, title, duration }),
  setClickThrough: (enabled) => ipcRenderer.invoke('set-click-through', enabled),
  setIgnoreMouseEvents: (ignore, options) => ipcRenderer.send('set-ignore-mouse-events', ignore, options),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
  seekPosition: (seconds) => ipcRenderer.invoke('seek-position', seconds),
  controlMedia: (action) => ipcRenderer.invoke('control-media', action),
  getAutoStart: () => ipcRenderer.invoke('get-autostart-state'),
  setAutoStart: (enable) => ipcRenderer.invoke('set-autostart-state', enable),
  
  // Window Controls
  closeApp: () => ipcRenderer.send('window-close'),
  minimizeApp: () => ipcRenderer.send('window-minimize'),
  moveWindow: (deltaX, deltaY) => ipcRenderer.send('window-move', { deltaX, deltaY })
});
