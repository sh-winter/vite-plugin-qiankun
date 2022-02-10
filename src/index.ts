import path from 'path'
import slash from 'slash'
import { type Plugin, type ResolvedConfig } from 'vite'
import { type ServerResponse } from 'http'
import cheerio, { type Cheerio, type Element } from 'cheerio'
import isDataURL from 'valid-data-url'
import { type AssetURLOptions } from '@vue/compiler-sfc'
import { type NodeTransform } from '@vue/compiler-core'
import { parseSrcset, stringifySrcset } from 'srcset'

/** vite/packages/vite/src/node/plugins/importAnalysisBuild.ts:26 */
const preloadHelperId = 'vite/preload-helper'

const PUBLIC_PATH = '((window.proxy && window.proxy.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) || "").slice(0, -1)'

/** vite/packages/vite/src/node/plugins/asset.ts:78 */
const assetRE = /^export default "(?<assetURL>.*?)"$/
const sourceMarkerRE = /['"]__PUBLIC_PATH_SOURCE_MARKER__([A-Za-z0-9+/=]+)__['"]/g
const srcsetMarkerRE = /['"]__PUBLIC_PATH_SRCSET_MARKER__([A-Za-z0-9+/=]+)__['"]/g

/** vite/packages/vite/src/node/plugins/asset.ts:14 */
const assetMarkerRE = /['"](__VITE_ASSET__[a-z\d]{8}__(?:\$_(.*?)__)?)['"]/g
const preloadMarkerRE = /(['"]__VITE_PRELOAD__['"])/g

const defaultAssetUrlOptions: Required<AssetURLOptions> = {
  base: null,
  includeAbsolute: false,
  tags: {
    video: ['src', 'poster'],
    source: ['src', 'srcset'],
    img: ['src', 'srcset'],
    image: ['xlink:href', 'href'],
    use: ['xlink:href', 'href']
  }
}

const utf8ToBase64 = (utf8: string) => Buffer.from(utf8).toString('base64')
const base64ToUtf8 = (base64: string) => Buffer.from(base64, 'base64').toString('utf-8')

// vue compiler 插件，开发环境下使用，作用为注入 asset 标记
export const transformAssetUrl: NodeTransform = (node) => {
  if (node.type === 1) {
    if (!node.props.length) return

    const tags = defaultAssetUrlOptions.tags
    const attrs = tags[node.tag]
    if (!attrs) return

    node.props.forEach((attr) => {
      if (
        attr.type !== 6 ||
        !attrs.includes(attr.name) ||
        !attr?.value?.content
      ) return

      const { value, value: { content } } = attr

      if (attr.name === 'srcset') {
        value.content = `__PUBLIC_PATH_SRCSET_MARKER__${utf8ToBase64(content)}__`
      } else {
        if (
          content.startsWith('#') ||
          isDataURL(content)
        ) return
        value.content = `__PUBLIC_PATH_SOURCE_MARKER__${utf8ToBase64(content)}__`
      }
    })
  }
}

export interface PublicPathOptions {
  packageName: string
}

const moduleScriptToGeneralScript = (script$: Cheerio<Element>) => {
  if (!script$) return
  const scriptSrc = script$.attr('src')
  if (!scriptSrc) return
  script$
    .removeAttr('src')
    .removeAttr('type')
    .html(`import(${PUBLIC_PATH} + "${scriptSrc}")`)
}

export default (
  options: PublicPathOptions
): Plugin[] => {
  const { packageName } = options
  let config: ResolvedConfig
  return [
    /* 开发、发布的是否都要用的 */
    {
      name: 'vite-plugin-public-path:all',
      enforce: 'post',
      configResolved (_config) {
        config = _config
      },
      transformIndexHtml (html) { // 暴露 qiankun 生命周期钩子，配合 helper 使用
        const $ = cheerio.load(html)
        const scripts = $('script[type=module]')
        scripts.each((i, el) => moduleScriptToGeneralScript($(el)))
        const script$ = scripts.last()
        script$?.html(`
        ${script$.html()}
        window.appName = "${packageName}";
        window["${packageName}"] = {};
        ['bootstrap', 'mount', 'unmount'].map(key => {
          let resolve, reject;
          let promise = new Promise((_resolve, _reject) => (resolve = _resolve, reject = _reject));
          window["${packageName}"][key] = Object.assign(
            (...args) => promise.then(lifeCycleHook => lifeCycleHook(...args)),
            { resolve, reject }
          );
        });
        `.trimEnd() + '\n\t')

        return $.html()
      }
    },
    /* 开发时用的 */
    {
      name: 'vite-plugin-public-path:serve',
      enforce: 'post',
      apply: 'serve',
      configureServer (server) { // 代理 serverResponse 的 end 方法，用于拦截处理 vite 最终注入的 @vite/client 热更程序
        return () => {
          server.middlewares.use((req, res, next) => {
            if (config.isProduction) return next()

            const end = res.end.bind(res) as ServerResponse['end']

            res.end = (html, ...args) => {
              if (typeof html === 'string') {
                const $ = cheerio.load(html)
                const viteClientScript = $(`script[src=${config.base}@vite/client]`)[0]
                moduleScriptToGeneralScript($(viteClientScript))
                html = $.html()
              }
              return end(html, ...args)
            }
            next()
          })
        }
      },
      transform (code, id) {
        if (assetRE.test(code)) { // 动态导入资源文件处理
          const url = config.base + slash(path.relative(config.root, id))
          const assetURL = code?.match?.(assetRE)?.groups?.assetURL

          if (url === assetURL) {
            /** vite/packages/vite/src/node/plugins/asset.ts */
            code = code.replace(
              assetRE,
              `export default ${PUBLIC_PATH} + "$1"`
            )
          }
        } else if (id.toLowerCase().endsWith('.vue')) { // vue 文件处理
          /** vue/packages/compiler-sfc/src/templateTransformAssetUrl.ts */
          code = code.replace(sourceMarkerRE, (match, $1) => { // 替换 url 类型的属性
            return `${PUBLIC_PATH} + "${base64ToUtf8($1)}"`
          })

          /** vue/packages/compiler-sfc/src/templateTransformSrcset.ts */
          code = code.replace(srcsetMarkerRE, (match, $1) => { // 替换 srcset 类型的属性
            const srcsetText = base64ToUtf8($1)
            const newSrcsetTexts = parseSrcset(srcsetText).map(
              (srcsetDef): string => {
                if (isDataURL(srcsetDef.url)) return `"${stringifySrcset([srcsetDef])}"`

                const newSrcsetDef = isDataURL(srcsetDef.url)
                  ? srcsetDef
                  : {
                      ...srcsetDef,
                      url: `${PUBLIC_PATH} + "${srcsetDef.url}`
                    }

                return `${stringifySrcset([newSrcsetDef])}"`
              }
            )

            return newSrcsetTexts.join(' + ", " + ')
          })
        }

        return code
      }
    },
    /* 发布时用的 */
    {
      name: 'vite-plugin-public-path:build',
      enforce: 'post',
      apply: 'build',
      transform (code, id) {
        if (id === preloadHelperId) { // vite 在处理预加载时，会直接将 base 附加在内容前面，我们需要将它给替换掉
          /** vite/packages/vite/src/node/plugins/importAnalysisBuild.ts */
          return code.replace(/const base = ['"].*?['"]/, "const base = ''")
        }
        // 此时，vite 还没有替换掉 asset 的标记，把路径给拼接上
        code = code.replace(assetMarkerRE, `${PUBLIC_PATH} + "$1"`)
        return code
      },
      transformIndexHtml (html) { // qiankun 依赖项中的 html-import-entry 暂不支持 modulepreload，所以暂时替换为 preload
        const $ = cheerio.load(html)
        $('link[rel=modulepreload]').each((i, link) => {
          $(link)
            .attr('rel', 'preload')
            .attr('as', 'script')
        })
        return $.html()
      },
      generateBundle ({ format }, bundle) { // 处理预加载资源，添加动态公共路径
        if (format !== 'es') return

        for (const chunk of Object.values(bundle)) {
          if (chunk.type !== 'chunk') continue
          chunk.code = chunk.code
            .replace(
              preloadMarkerRE,
              `$1.map(url => ${PUBLIC_PATH} + "${config.base}" + \`\${url}\`)`
            )
        }
      }
    }
  ]
}
