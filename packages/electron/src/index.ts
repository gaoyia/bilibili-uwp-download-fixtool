import { app, dialog, ipcMain } from "electron";
import path from "path";
import MainWin from "./Window/MainWin";

import fs from "fs";
import isDev from "./utils/isDev";

function readFileList (dir: string, _filesList: Array<string> = []) {
  const filesList: Array<string> = _filesList;
  const files = fs.readdirSync(dir);
  files.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList);  // 递归读取文件
    } else if (stat.isFile()) {
      if (/(.mp4$)/.test(fullPath)) {
        filesList.push(fullPath);
      }
    }
  });
  return filesList;
}

app.disableHardwareAcceleration(); // 禁用GPU加速

app.whenReady().then(async () => {
  const preload = path.join(__dirname, "preload.js");
  const mainWin = new MainWin({
    autoHideMenuBar: true,
    webPreferences: {
      devTools: isDev,
      contextIsolation: true,
      preload,
    },
  });
  mainWin.loadPage();


  ipcMain.handle("selectFolder", async (event, data) => {
    const res = await dialog.showOpenDialog({
      title: data.title,
      properties: data.properties,
    });
    return res;
  });

  ipcMain.handle("checkFile", async (event, data: { path: string }[]) => {
    const filesList: string[] = [];
    data.forEach(dir => {
      readFileList(dir.path, filesList);
    });
    const mp4List = Array.from(new Set(filesList));
    const checkedList: string[] = [];
    mp4List.forEach((mp4: string) => {
      try {
        const rbuf = fs.readFileSync(mp4);
        const header = rbuf.slice(0, 3);
        if (header[ 0 ] === 255 && header[ 1 ] === 255 && header[ 2 ] === 255) {
          checkedList.push(mp4);
        }
      } catch (err) {
        console.log(err);
      }
    });
    return checkedList;
  });

  ipcMain.handle("fixFile", async (event, data: { path: string }[]) => {
    const fixedList: string[] = [];
    const fixErrList: string[] = [];

    data.forEach((i) => {
      const mp4 = i.path;
      try {
        const rbuf = fs.readFileSync(mp4);
        const header = rbuf.slice(0, 3);
        if (header[ 0 ] === 255 && header[ 1 ] === 255 && header[ 2 ] === 255) {
          // 把修改过的文件写入新文件
          fs.writeFileSync(mp4 + "_newFile", rbuf.slice(3));
          // 删除旧文件
          fs.unlinkSync(mp4);
          // 重名新文件
          fs.renameSync(mp4 + "_newFile", mp4);
          fixedList.push(mp4);
        }
      } catch (err) {
        fixErrList.push(mp4);
        console.log(err);
      }
    });
    return {
      fixedList,
      fixErrList,
    };
  });

});
