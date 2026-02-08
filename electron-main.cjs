const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const prefs = require('./lib/prefs.cjs');
const autoUpdaterModule = require('./lib/auto-updater.cjs');
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
      preload: path.join(__dirname, 'lib', 'preload.cjs')
    }
  });
  Menu.setApplicationMenu(null);
  // F12
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      mainWindow.webContents.openDevTools();
      event.preventDefault();
    }
  });

  //mainWindow.loadURL('http://localhost:5173');
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
}


app.whenReady().then(async () => {
  await prefs.initStore();
  prefs.registerIPC();
  // Notify renderers when prefs change
  if (typeof prefs.registerChangeListeners === 'function') prefs.registerChangeListeners();
  createWindow();
  autoUpdaterModule.setupAutoUpdater(prefs.getStore());

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
