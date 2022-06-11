import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html,info) {
      if (info?.server?.config?.command !== 'serve') {
        return html.replace(
          /<!-- Content-Security-Policy -->/,
          `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'">`
        )
      } else {
        return html
      }
    },
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),htmlPlugin()],
  base:"./"
})
