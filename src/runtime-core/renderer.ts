import { isObject, isOn } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  const { type, shapeFlags } = vnode
  switch (type) {
    case Fragment:
      processFragment(vnode, container)
      break
    case Text:
      processText(vnode, container)
      break
    default:
      if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container)
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
      }
      break
  }
}
function processFragment(vnode: any, container: any) {
  mountChildren(vnode, container)
}

function processText(vnode: any, container: any) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  // 这个虚拟节点是属于element的
  const el = (vnode.el = document.createElement(vnode.type))

  // 对子组件进行解析
  const { children, shapeFlags } = vnode
  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  // 对props进行解析
  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    // 事件注册
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container)
  })
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(initialVnode, container) {
  const instance = createComponentInstance(initialVnode)

  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  patch(subTree, container)

  // 要在所有element挂载完之后，把根元素的el挂载到组件的虚拟节点上
  initialVNode.el = subTree.el
}
