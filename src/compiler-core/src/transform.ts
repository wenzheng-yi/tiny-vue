import { NodeTypes } from './ast'
import { TO_DISPLAY_STRING } from './runtimeHelpers'

export function transform(root, options = {}) {
  const context = createTransformContext(root, options)
  // 遍历-深度优先搜索
  traverseNode(root, context)

  createRootCodegen(root)

  root.helpers = [...context.helpers.keys()]
}
function traverseNode(node: any, context) {
  const nodeTransforms = context.nodeTransforms
  if (nodeTransforms) {
    for (let i = 0; i < context.nodeTransforms.length; i++) {
      const nodeTransform = context.nodeTransforms[i]
      nodeTransform(node, context)
    }
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break
    default:
      break
  }
}
function traverseChildren(node: any, context: any) {
  const children = node.children
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    traverseNode(node, context)
  }
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms,
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1)
    },
  }
  return context
}
function createRootCodegen(root: any) {
  root.codegenNode = root.children[0]
}
