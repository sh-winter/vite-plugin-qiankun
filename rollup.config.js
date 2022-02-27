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

const configs = [
  {
    input: ['./src/index.ts'],
    'output:format': 'es',
    'output:entryFileNames': '[name].mjs'
  },
  {
    input: ['./src/index.ts'],
    'output:format': 'cjs',
    'output:entryFileNames': '[name].js'
  },
  {
    input: ['./src/helper.ts'],
    'output:format': 'es',
    'output:entryFileNames': '[name].js'
  }
]

/**
 * 生成 rollup config
 * @param {configs[0]} config
 * @returns {import('rollup').RollupOptions}
 */
function genConfig (config) {
  return {
    input: config.input,
    external: [
      'path',
      ...Object.keys(pkg.dependencies)
    ],
    plugins: [
      typescript()
    ],
    output: {
      format: config['output:format'],
      banner,
      entryFileNames: config['output:entryFileNames'],
      dir: 'dist',
      name: pkg.name,
      exports: 'named'
    }
  }
}

export default defineConfig(configs.map(genConfig))
