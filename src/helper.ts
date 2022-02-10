type QiankunWindow = {
  __POWERED_BY_QIANKUN__?: boolean,
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string,
  [x: string]: any
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    proxy: QiankunWindow
  }
}

type Hook = (...args: any[]) => unknown | Promise<unknown>
type LifeCycleHooks = {
  bootstrap: Hook,
  mount: Hook,
  unmount: Hook
}

export const qiankunWindow = window.proxy ?? (window as QiankunWindow)

export const exportLifeCycleHooks = ({ bootstrap, mount, unmount }: LifeCycleHooks) => {
  const appName = qiankunWindow.appName as string
  qiankunWindow[appName]?.bootstrap.resolve(bootstrap)
  qiankunWindow[appName]?.mount.resolve(mount)
  qiankunWindow[appName]?.unmount.resolve(unmount)
}

export default exportLifeCycleHooks
