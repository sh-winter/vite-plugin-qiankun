import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

const banner = `
/*!
  * ${pkg.name} v${pkg.version}
  * (c) 2022-${new Date().getFullYear()} sh-winter
  * Released under the MIT License.
  */
`
<<<<<<< Updated upstream

/**
 * 生成 rollup config
 * @param {'es'|'cjs'} format 
 * @returns {import('rollup').RollupOptions}
 */
function genConfig(format) {
  return {
    input: ['./src/index.ts', './src/helper.ts'],
    external: [
      'path',
      ...Object.keys(pkg.dependencies)
    ],
    plugins: [
      typescript()
    ],
    output: {
      format,
      banner,
      entryFileNames: `[name].${format === 'es' ? 'mjs' : 'js'}`,
      dir: 'dist',
      name: pkg.name,
      exports: 'named'
    }
=======
export default defineConfig({
  input: ['./src/index.ts', './src/helper.ts'],
  external: [
    ...Object.keys(pkg.dependencies)
  ],
  plugins: [
    typescript()
  ],
  output: {
    format: 'esm',
    banner,
    dir: 'dist',
    name: pkg.name,
    exports: 'auto'
>>>>>>> Stashed changes
  }
}

export default defineConfig([
  genConfig('es'),
  genConfig('cjs')
])
