export function transform(root, options) {
  const context = createTransformContext(root, options)
  // 1. 遍历-深度优先搜索
  traverseNode(root, context)
  // 2. 修改text content
}
function traverseNode(node: any, context) {
  const nodeTransforms = context.nodeTransforms
  if (nodeTransforms) {
    for (let i = 0; i < context.nodeTransforms.length; i++) {
      const nodeTransform = context.nodeTransforms[i]
      nodeTransform(node, context)
    }
  }

  traverseChildren(node, context)
}
function traverseChildren(node: any, context: any) {
  const children = node.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      traverseNode(node, context)
    }
  }
}

function createTransformContext(root: any, options: any) {
  return {
    root,
    nodeTransforms: options.nodeTransforms,
  }
}
