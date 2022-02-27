import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { name as packageName } from './package.json'
import qiankun, { transformAssetUrl } from '../../dist/index.mjs'
// import { qiankunPlugin, transformAssetUrl } from '@sh-winter/vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  base: `/${packageName}/`,
  server: {
    fs: {
      strict: false
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          nodeTransforms: [transformAssetUrl as any]
        }
      }
    }),
    qiankun({ packageName }) as any
  ]
})
