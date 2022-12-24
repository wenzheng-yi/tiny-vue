import { isString } from '@tiny-vue/shared'
import { NodeTypes } from './ast'
import {
  CREATE_ELEMENT_VNODE,
  helperMapName,
  TO_DISPLAY_STRING,
} from './runtimeHelpers'

export function generate(ast) {
  const context = createCodegenContext()
  const { push } = context

  genFunctionPreamble(ast, context)

  const functionName = 'render'
  const args = ['_ctx', '_cache']
  const signature = args.join(', ')
  push(`function ${functionName}(${signature}){`)

  push('return ')

  genNode(ast.codegenNode, context)

  push('}')

  return {
    code: context.code,
  }
}
function genFunctionPreamble(ast, context) {
  const { push, helper } = context
  const VueBinging = 'Vue'
  const aliasHelper = (s) => `${helper(s)}:_${helper(s)}`
  if (ast.helpers.length > 0) {
    push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinging}`)
  }
  push('\n')
  push('return ')
}

function genNode(node: any, context: any) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    case NodeTypes.ELEMENT:
      genElement(node, context)
      break
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context)
      break
    default:
      break
  }
}
function genText(node: any, context: any) {
  const { push } = context
  push(`'${node.content}'`)
}
function genElement(node, context) {
  const { push, helper } = context
  const { tag, children, props } = node
  push(`_${helper(CREATE_ELEMENT_VNODE)}(`)
  genNodeList(genNullable([tag, props, children]), context)
  push(')')
}
function genNodeList(nodes, context) {
  const { push } = context
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (isString(node)) {
      push(node)
    } else {
      genNode(node, context)
    }
    if (i < nodes.length - 1) {
      push(', ')
    }
  }
}
function genNullable(args: any[]) {
  return args.map((arg) => arg || 'null')
}
function genCompoundExpression(node, context) {
  const { push } = context
  const children = node.children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (isString(child)) {
      push(child)
    } else {
      genNode(child, context)
    }
  }
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
    helper(key) {
      return `${helperMapName[key]}`
    },
  }
  return context
}
function genInterpolation(node: any, context: any) {
  const { push, helper } = context
  push(`_${helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(')')
}
function genExpression(node, context) {
  const { push } = context
  push(`${node.content}`)
}
