import { render } from "./renderer"
import { createVNode } from "./vnode"

export function createApp(rootComponent) {
  return {
    mount(rootContainerId) {
      const rootContainer = document.querySelector(rootContainerId)
      const vnode = createVNode(rootContainer)
      render(vnode, rootContainer)
    }
  }
}