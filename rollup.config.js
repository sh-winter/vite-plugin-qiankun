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
      entryFileNames: `[name].${format === 'es' ? 'mjs' : 'cjs'}`,
      dir: 'dist',
      name: pkg.name,
      exports: 'auto'
    }
  }
}

export default defineConfig([
  genConfig('es'),
  genConfig('cjs')
])
