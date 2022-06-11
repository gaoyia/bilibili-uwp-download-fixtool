import { createApp } from 'vue'
import App from './App.vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

createApp(App).use(VXETable).mount('#app')

declare global {
  interface Window {
    invoke:(channel: string, data:any)=>Promise<any>
  }
}
