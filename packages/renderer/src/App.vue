<template>
<h1>1.选择下载根目录</h1>
<button @click="selectFolder">添加目录</button>
<button @click="removeAllFolder">清空目录</button>
  <vxe-table :data="dirList" :height="500">
    <vxe-column field="path" title="待检测目录"></vxe-column>
  </vxe-table>
<p>选择目录后将检测目录下所有mp4文件是否需要修复，并将文件列出</p>
<hr>
<h1>2.点击检测</h1>
<p>检测目录下的mp4文件是否需要修复，但是不会执行修复功能.</p>
<p style="color:red">目前点击按钮会卡顿，暂未优化，先实现功能</p>
<button @click="checkFile">检测</button>
<vxe-table :data="needFixFileList"  :height="500">
  <vxe-column field="path" title="待修复文件"></vxe-column>
</vxe-table>
<h1>3.修复文件</h1>
<p style="color:red">目前点击按钮会卡顿，暂未优化，先实现功能</p>
<button @click="fixFile">修复</button>
<div>
  修复成功文件列表
  <vxe-table :data="fixedList"  :height="500">
    <vxe-column field="path" title="文件路径"></vxe-column>
  </vxe-table>
  修复失败文件列表
  <vxe-table :data="fixErrList"  :height="500">
    <vxe-column field="path" title="文件路径"></vxe-column>
  </vxe-table>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {cloneDeep} from "lodash"

let dirList = ref([
])
function removeAllFolder() {
  dirList.value = []
}
async function selectFolder() {
  const data = await window.invoke("selectFolder",{
    title:"选择-UWP-bilibili下载目录",
    properties: ["openDirectory", "multiSelections", "showHiddenFiles"]
  })
  if(!data.canceled){
    const list = data.filePaths.map((i:string)=>({path:i}))
    dirList.value = dirList.value.concat(list)
  }
}

const needFixFileList = ref([
])
async function checkFile() {
  const mp4List = await window.invoke("checkFile",cloneDeep(dirList.value))
    needFixFileList.value = mp4List.map((path:string)=>({path}))
}
const fixedList = ref([
])
const fixErrList = ref([
])
async function fixFile() {
  const res = await window.invoke("fixFile",cloneDeep(needFixFileList.value))
  fixedList.value = res.fixedList.map((path:string)=>({path}))
  fixErrList.value = res.fixErrList.map((path:string)=>({path}))
}
</script>

<style>
* {
user-select: none;
}
</style>
