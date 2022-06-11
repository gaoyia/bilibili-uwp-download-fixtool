import { BrowserWindow, BrowserWindowConstructorOptions, dialog, ipcMain, MessageChannelMain } from "electron";
import isDev from "../utils/isDev";

export default class MainWin extends BrowserWindow {

  constructor (opt: BrowserWindowConstructorOptions) {
    super(opt);
  }

  // 定义开发url
  private DEV_PATH: string = "http://localhost:3000";

  // 定义开发url
  private PRO_PATH: string = "../index.html";

  // 加载页面
  loadPage () {
    if (isDev) {
      this.loadURL(this.DEV_PATH);
    } else {
      this.loadFile(this.PRO_PATH);
    }
  }
}
