import { BrowserWindow, BrowserWindowConstructorOptions, MessageChannelMain } from "electron";
import isDev from "../utils/isDev";

export default class MainWin extends BrowserWindow {

  constructor(opt:BrowserWindowConstructorOptions) {
    super(opt)
  }

  // 定义开发url
  private DEV_PATH:string = "http://localhost:3000"

  // 定义开发url
  private PRO_PATH:string = "../index.html"
  
  // 加载页面
  loadPage(){
    if (isDev) {
      this.loadURL(this.DEV_PATH)
    } else {
      this.loadFile(this.PRO_PATH)
    }
  }

  mainWinPort:Electron.MessagePortMain | undefined
  mainPort:Electron.MessagePortMain | undefined
  buildBridge() {
    this.webContents.removeAllListeners('did-finish-load')
    this.webContents.addListener('did-finish-load', ()=>{
      const ports = new MessageChannelMain()
      this.mainPort = ports.port1
      this.mainWinPort = ports.port2
      this.sendMsg("connected")
      // 监听来自网页的消息
      this.mainPort.on('message', (event: any) => {
        console.log('from renderer main world:', event.data)
      })
      this.mainPort.start()
      this.webContents.postMessage('node-port', null, [ this.mainWinPort ])
    })
  }
  sendMsg(cmd:string, data?:unknown){
    if (this.mainPort) {
      this.mainPort?.postMessage({ 
        cmd,
        data
      })
    } else {
      console.error("通信尚未建立");
    }
  }
}
