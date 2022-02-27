import { exec as _exec, spawn } from 'child_process'
import { Server } from 'http'
import { AddressInfo } from 'net'
import * as path from 'path'
import { promisify } from 'util'
import { normalizePath } from 'vite'

const exec = promisify(_exec)

type ServerConfig = {
  name: string,
  port: number
}

const serverConfigs: ServerConfig[] = [
  {
    name: 'main',
    port: 3000
  },
  {
    name: 'micro',
    port: 5000
  }
]

// 运行服务器
async function runServer (
  { build, preview }: typeof import('vite'),
  { name, port }: ServerConfig
) {
  let viteConfig: import('vite').InlineConfig = await import(`../example/${name}/vite.config`).then(module => module.default)

  /** @ts-ignore */
  const root = normalizePath(path.join(import.meta.url, `../../example/${name}`)).slice(6)

  viteConfig = {
    ...viteConfig,
    root,
    configFile: false,
    logLevel: 'error',
    server: { // 如端口已占用尝试其他端口
      ...(viteConfig.server ?? {}),
      strictPort: false
    },
    preview: { // 设置指定的端口，并且不自动打开页面
      ...(viteConfig.preview ?? {}),
      port,
      open: false
    }
  }

  await build(viteConfig)

  return (await (preview(viteConfig))).httpServer
}

async function run () {
  // 安装依赖

  console.log('installing dependencies...')
  await exec('yarn', { cwd: '../example/' })

  console.log('dependent installation complete.')

  const viteModule = await import('vite')

  console.log('starting sample server...')
  const tasks = serverConfigs.map<Server>(runServer.bind(null, viteModule))
  const httpServers = await Promise.all(tasks)

  console.log('sample server started.')

  try {
    const { address, port } = httpServers[0].address() as AddressInfo
    const baseUrl = `http://${address}:${port}`

    await new Promise((resolve, reject) => {
      const process = spawn(
        '.\\node_modules\\.bin\\cypress.cmd',
        ['run', '--env', `baseUrl=${baseUrl}`],
        {
          shell: true,
          cwd: '../',
          stdio: 'inherit'
        }
      )

      process.on('exit', resolve)
      process.on('error', reject)
    })
  } finally {
    httpServers.forEach(server => server.close())
  }
}

run()
