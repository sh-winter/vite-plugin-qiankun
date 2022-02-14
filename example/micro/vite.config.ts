import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { name as packageName } from './package.json'
import { qiankunPlugin, transformAssetUrl } from '@sh-winter/vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  base: `/${packageName}/`,
  plugins: [
    vue({
      template: {
        compilerOptions: {
          nodeTransforms: [transformAssetUrl as any]
        }
      }
    }),
    qiankunPlugin({ packageName })
  ]
})
