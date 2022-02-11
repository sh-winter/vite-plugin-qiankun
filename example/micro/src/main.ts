import { createApp, type App as AppType } from 'vue'
import App from './App.vue'
import router from './router'
import exportLifeCycleHooks, { qiankunWindow } from '@sh-winter/vite-plugin-qiankun/dist/helper'

let app: AppType

function render (root: Element | Document = document) {
  app = createApp(App)

  app.use(router)
    .mount(root.querySelector('#app'))
}

exportLifeCycleHooks({
  bootstrap () {
    // do nothing.
  },
  mount (props: { container: Element }) {
    render(props.container)
  },
  unmount () {
    app?.unmount()
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
