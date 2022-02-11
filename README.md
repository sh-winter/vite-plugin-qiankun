### 简介

> 简化 `vite` 子应用接入 `qiankun` 的流程

### 快速开始

#### 1. 安装 `vite` 插件
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

#### 2. 导出 `qiankun` 生命周期钩子
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

#### 3. 注意事项

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

### 查看示例

```bash
cd example
yarn

# 启动主应用(react)
yarn run:main
# or
yarn run:main-build

# 启动子应用(vue3)
yarn run:micro
# or
yarn run:micro-build
```
