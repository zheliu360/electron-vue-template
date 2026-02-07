// 用户偏好设置模块，使用 electron-store 来持久化设置，并通过 IPC 与渲染进程通信
const { app } = require('electron');
const { ipcMain, BrowserWindow } = require('electron');
let store = null;
async function initStore() {
  const { default: Store } = await import('electron-store');
  const baseDir = process.env.ELECTRON_PREFS_DIR || app.getPath('userData');
  store = new Store({
    defaults: {
      cwd: baseDir,
      autoUpdate: false
    }
  });
}

// broadcast change to all renderer windows
function broadcastChange(key, value) {
  for (const w of BrowserWindow.getAllWindows()) {
    if (w && w.webContents) w.webContents.send('prefs:changed', { key, value })
  }
}

function getStore() {
  return store;
}

function registerIPC() {
  ipcMain.handle('prefs:get-auto-update', () => {
    return store.get('autoUpdate');
  });

  ipcMain.handle('prefs:set-auto-update', (_, value) => {
    store.set('autoUpdate', !!value);
    return store.get('autoUpdate');
  });
}

function registerChangeListeners() {
  store.onDidChange('autoUpdate', (newValue) => {
    broadcastChange('autoUpdate', newValue);
  });
}

module.exports = { initStore, registerIPC, getStore, registerChangeListeners };
