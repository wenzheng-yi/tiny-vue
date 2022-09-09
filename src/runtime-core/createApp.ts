import { createVNode } from './vnode'

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainerId) {
        const rootContainer = document.querySelector(rootContainerId)
        const vnode = createVNode(rootComponent)
        render(vnode, rootContainer)
      },
    }
  }
}
