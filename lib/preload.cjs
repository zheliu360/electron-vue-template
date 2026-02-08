// 渲染进程的预加载脚本，用于暴露安全的 API 给渲染进程
const { contextBridge, ipcRenderer } = require('electron');

// 用户偏好设置相关 API
contextBridge.exposeInMainWorld('prefs', {
  get: (key) => {
    if (key === 'autoUpdate') return ipcRenderer.invoke('prefs:get-auto-update')
    return Promise.resolve(null)
  },
  set: (key, value) => {
    if (key === 'autoUpdate') return ipcRenderer.invoke('prefs:set-auto-update', value)
    return Promise.resolve(null)
  },
  
  onChanged: (cb) => {
    const listener = (_, payload) => cb(payload)
    ipcRenderer.on('prefs:changed', listener)
    return () => ipcRenderer.removeListener('prefs:changed', listener)
  }
});
