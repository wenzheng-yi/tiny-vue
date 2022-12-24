import { NodeTypes } from '../ast'

export function transformExpression(node) {
  if (node.type === NodeTypes.INTERPOLATION) {
    node.content.content = '_ctx.' + node.content.content
  }
}
