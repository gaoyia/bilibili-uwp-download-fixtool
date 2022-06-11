const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("invoke", ipcRenderer.invoke);
