const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen, globalShortcut } = require('electron');
const path = require('path');
const { fetchLyrics } = require('./services/lrclib');
const MediaListener = require('./services/mediaListener');

let mainWindow = null;
let tray = null;
let mediaListener = null;
let isClickThrough = false;
let isAlwaysOnTop = true;

function createIcon() {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8b5cf6" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#grad)" />
      <path d="M12 10v12l10-6z" fill="#ffffff"/>
    </svg>`;
  return nativeImage.createFromBuffer(Buffer.from(svgIcon));
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: workWidth, height: workHeight } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 440,
    height: 300,
    x: workWidth - 460,
    y: workHeight - 340,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    hasShadow: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const icon = createIcon();
  tray = new Tray(icon);
  tray.setToolTip('Desktop Lyrics Widget (Kilit Kısayolu: Ctrl+Alt+L)');

  updateTrayMenu();
}

function updateTrayMenu() {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🎵 Desktop Lyrics Widget',
      enabled: false
    },
    {
      label: '⌨ Kısayol: Ctrl + Alt + L',
      enabled: false
    },
    { type: 'separator' },
    {
      label: isClickThrough ? '🔓 Click-Through: AÇIK (Tıklama Alta Geçer)' : '🔒 Click-Through: KAPALI (İnteraktif)',
      type: 'checkbox',
      checked: isClickThrough,
      click: () => toggleClickThrough(!isClickThrough)
    },
    {
      label: '📌 Hep Üstte Kal',
      type: 'checkbox',
      checked: isAlwaysOnTop,
      click: () => {
        isAlwaysOnTop = !isAlwaysOnTop;
        if (mainWindow) mainWindow.setAlwaysOnTop(isAlwaysOnTop, 'screen-saver');
        updateTrayMenu();
      }
    },
    {
      label: '🚀 Başlangıçta Çalıştır',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: () => {
        const current = app.getLoginItemSettings().openAtLogin;
        app.setLoginItemSettings({ openAtLogin: !current, path: process.execPath });
        updateTrayMenu();
        if (mainWindow) mainWindow.webContents.send('autostart-state-changed', !current);
      }
    },
    { type: 'separator' },
    {
      label: '❌ Çıkış',
      click: () => app.quit()
    }
  ]);

  tray.setContextMenu(contextMenu);
}

function toggleClickThrough(enable) {
  isClickThrough = enable;
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(isClickThrough, { forward: true });
    mainWindow.webContents.send('click-through-state', isClickThrough);
  }
  updateTrayMenu();
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  try {
    globalShortcut.register('CommandOrControl+Alt+L', () => {
      toggleClickThrough(!isClickThrough);
    });
  } catch (e) {
    console.warn('Could not register global hotkey:', e);
  }

  mediaListener = new MediaListener();

  mediaListener.on('trackChange', async (data) => {
    let lyricsData = null;

    if (data.track && data.track.title) {
      lyricsData = await fetchLyrics(data.track.artist, data.track.title, data.track.duration);
    }

    if (mainWindow) {
      mainWindow.webContents.send('media-changed', {
        track: data.track,
        position: data.position,
        duration: data.duration,
        status: data.status,
        lyricsData
      });
    }
  });

  mediaListener.on('positionUpdate', (data) => {
    if (mainWindow) {
      mainWindow.webContents.send('position-updated', data);
    }
  });

  mediaListener.startPolling(800);
});

// IPC Handlers
ipcMain.handle('fetch-lyrics', async (event, { artist, title, duration }) => {
  return await fetchLyrics(artist, title, duration);
});

ipcMain.handle('set-click-through', (event, enabled) => {
  toggleClickThrough(enabled);
  return isClickThrough;
});

ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.setIgnoreMouseEvents(ignore, options);
  }
});

ipcMain.handle('toggle-always-on-top', () => {
  if (mainWindow) {
    isAlwaysOnTop = !isAlwaysOnTop;
    mainWindow.setAlwaysOnTop(isAlwaysOnTop, 'screen-saver');
    updateTrayMenu();
  }
  return isAlwaysOnTop;
});

ipcMain.handle('seek-position', (event, seconds) => {
  if (mediaListener) mediaListener.seek(seconds);
  return true;
});

ipcMain.handle('control-media', (event, action) => {
  if (mediaListener) mediaListener.controlMedia(action);
  return true;
});

ipcMain.handle('get-autostart-state', () => {
  const settings = app.getLoginItemSettings();
  return settings.openAtLogin;
});

ipcMain.handle('set-autostart-state', (event, enable) => {
  app.setLoginItemSettings({
    openAtLogin: Boolean(enable),
    path: process.execPath
  });
  updateTrayMenu();
  return app.getLoginItemSettings().openAtLogin;
});

ipcMain.on('window-close', () => {
  app.quit();
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-move', (event, { deltaX, deltaY }) => {
  if (mainWindow) {
    const [currentX, currentY] = mainWindow.getPosition();
    mainWindow.setPosition(currentX + deltaX, currentY + deltaY);
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
