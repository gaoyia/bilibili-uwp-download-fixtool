import { app, MessageChannelMain }  from "electron"
import path from "path"
import MainWin from "./Window/MainWin"

app.disableHardwareAcceleration() // 禁用GPU加速
app.whenReady().then(async () => {
  const preload = path.join(__dirname, 'preload.js')
  const mainWin = new MainWin({
    webPreferences: {
      contextIsolation: true,
      preload,
    }
  })
  mainWin.loadPage()
  mainWin.buildBridge()
})
