import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

const banner = `
/*!
  * ${pkg.name} v${pkg.version}
  * (c) 2021-${new Date().getFullYear()} sh-winter
  * Released under the MIT License.
  */
`
export default defineConfig({
  input: ['./src/index.ts', './src/helper.ts'],
  external: pkg.dependencies,
  plugins: [
    typescript()
  ],
  output: {
    format: 'es',
    banner,
    dir: 'dist',
    name: pkg.name,
    exports: 'auto'
  }
})
