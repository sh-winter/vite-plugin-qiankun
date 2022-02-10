import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { name as packageName } from './package.json'
import dynamicPublicPath, { transformAssetUrl } from '@sh-winter/vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: `/${packageName}/`,
    plugins: [
      vue({
        template: {
          compilerOptions: {
            nodeTransforms: [transformAssetUrl as any]
          }
        }
      }),
      dynamicPublicPath({ packageName })
    ]
  }
})
