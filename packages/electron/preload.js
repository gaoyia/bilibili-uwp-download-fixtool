/* eslint-disable no-undef */
const { ipcRenderer } = require("electron");
// 我们需要等待主进程准备好后, 再发送端口 我们在预加载时创建此 promise ，以此保证
// 在触发 load 事件之前注册 onload 侦听器。
const windowLoaded = new Promise(resolve => {
  window.onload = resolve;
});

ipcRenderer.on("node-port", async (event) => {
  await windowLoaded();
  // 我们使用 window.postMessage 将端口
  // 发送到主进程
  window.postMessage("node-port", "*", event.ports);
});
