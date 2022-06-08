# 哔哩哔哩 UWP 下载 修复工具

1. 解决下载的文件无法被第三方播放器播放的问题
2. 将未合并的视频合并（计划）
3. 直接在工具中播放下载的视频（计划）

## 项目架构说明

### 开发依赖

1. yarn2 - workspace
1. Electron
1. TypeScript
1. vue3 - naiveUI - vex-table

### 文件目录与架构说明
---
* `__test__` 是测试目录
---
* `out` 是打包输出目录
* `out/source` 是处理打包前合并源码的目录
* `out/pack` 是绿色版打包输出目录
* `out/build` 是安装包的输出目录
---
* `packages` 是子项目目录
* `packages/electron` 是`electron项目`目录
* `packages/fix-worker` 是`工作线程`目录
* `packages/renderer` 是`渲染界面`项目目录
---
* `gulp` 是 gulp 脚本模块目录
---

该项目使用node Worker管理修复进度

主进程是electron的node进程
主进程开始修复时创建工作线程`fix-worker`，工作线程对单个视频文件进行处理。
界面可配置最大线程数，且不大于CPU线程数，且不大于10。

### 打包流程
1. 使用 `vite-vue3`自带打包脚本在renderer项目打包生成`renderer/dist`
2. 使用 `tsc` 编译electron项目并输出到`electron/dist`
3. 使用 `tsc` 编译fix-worker项目并输出到`fix-worker/dist`
4. 使用 `gulp` 将以上三个包复制到`out/source`
5. 使用 `gulp` 删除`out/source->package.json`项目中的开发依赖
6. 使用 `gulp` 执行`npm i`安装 `out/source`
