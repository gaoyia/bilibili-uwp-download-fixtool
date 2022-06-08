<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
window.onmessage = (event) => {
  // event.source === window 表示消息来自预加载脚本
  // 而不是来自 <iframe> 或其他来源
  if (event.source === window && event.data === 'main-world-port') {
    const [ port ] = event.ports
    // 一旦我们有了这个端口，我们就可以直接与主进程通信
    port.onmessage = (event) => {
      console.log('from main process:', event.data)
      port.postMessage(event.data * 2)
    }
  }
}
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png">

  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
