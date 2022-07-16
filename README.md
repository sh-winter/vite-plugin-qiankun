# vite-plugin-qiankun


简化 `vite` 子应用接入 `qiankun` 的流程

## 要求

此包适用于 vite 2.6+ ，不包含 vite 3.0。

## 安装

使用 `npm`:

```console
$ npm install @sh-winter/vite-plugin-qiankun --save-dev
```



## 用法

### 1. 注册插件

```ts
// vite.config.ts
import qiankun from '@sh-winter/vite-plugin-qiankun'
import { name as packageName } from './package.json'

export default {
  base: `/${packageName}/`
  plugins: [
    qiankun({ packageName })
  ]
}
```

### 2. 子应用导出 `qiankun` 生命周期钩子

```ts
// main.ts
import { exportLifeCycleHooks, qiankunWindow } from '@sh-winter/vite-plugin-qiankun/dist/helper'

// some code

function render(root: Element | Document = document) {
  app = createApp(App)
  app.mount(root.querySelector('#app'))
}

exportLifeCycleHooks({
  bootstrap() {
    // do nothing.
  },
  mount(props: { container: Element }) {
    render(props.container);
  },
  unmount() {
    app?.unmount();
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
```

### 3. 注意事项

1. `es module` 会导致 `qiankun` 沙箱失效，如果想要访问 `qiankun` 提供的代理 `window`，请使用 `qiankunWindow`

  ```ts
import { qiankunWindow } from '@sh-winter/vite-plugin-qiankun/dist/helper'
  ```

2. 如果是 `vue` 子应用，开发环境下需要额外引入 `vue-template-compiler transform` 插件：`transformAssetUrl`

  ```ts
  // vite.config.ts

  import qiankun, { transformAssetUrl } from '@sh-winter/vite-plugin-qiankun'

  export default {
    // ...
    plugins: [
      vue({
        template: {
          compilerOptions: {
            nodeTransforms: [transformAssetUrl as any]
          }
        }
      }),
      qiankun({ packageName })
    ]
  }
  ```

## 查看示例

```bash
npm run example
```