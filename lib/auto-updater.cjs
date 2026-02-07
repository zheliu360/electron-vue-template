const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
function setupAutoUpdater(store) {
  if (!store.get('autoUpdate')) return;
  setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 1000);

  autoUpdater.on('update-downloaded', () => {
    const choice = dialog.showMessageBoxSync({
      type: 'question',
      buttons: ['现在安装并重启', '稍后'],
      defaultId: 0,
      cancelId: 1,
      title: '更新可用',
      message: '新版本已下载，是否立即安装并重启？'
    });

    if (choice === 0) {
      autoUpdater.quitAndInstall();
    }
  });
}

module.exports = { setupAutoUpdater };