const { app, BrowserWindow, Menu } = require('electron')
const path = require('path');
const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { contextIsolation: true, nodeIntegration: false, devTools: true }
  });

  Menu.setApplicationMenu(null);

  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') { win.webContents.openDevTools(); event.preventDefault(); }
  });

  //win.loadURL('http://localhost:5173');
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(() => {
  createWindow()

  // 仅在已打包的应用中自动检查更新
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();

    // 下载完成后提示用户安装
    autoUpdater.on('update-downloaded', () => {
      const res = dialog.showMessageBoxSync({
        type: 'question',
        buttons: ['现在安装并重启', '稍后'],
        defaultId: 0,
        cancelId: 1,
        title: '更新可用',
        message: '新版本已下载，是否立即安装并重启？'
      });
      if (res === 0) autoUpdater.quitAndInstall();
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})