#### 简介

> 简化 `vite` 子应用接入 `qiankun` 的流程

#### 快速开始

##### 1. 安装 `vite` 插件
```ts
// vite.config.ts

import qiankun from '@sh-winter/vite-plugin-qiankun'
import { name as pkgName } from './package.json'

export default {
  base: 'https://xxx.com/'
  plugins: [
    qiankun(pkgName)
  ]
}
```

##### 2. 导出 `qiankun` 生命周期钩子
```ts
// main.ts

import { exportLifeCycleHooks, qiankunWindow } from '@sh-winter/vite-plugin-qiankun'

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