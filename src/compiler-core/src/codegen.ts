import { NodeTypes } from './ast'
import { helperMapName, TO_DISPLAY_STRING } from './runtimeHelpers'

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
    default:
      break
  }
}
function genText(node: any, context: any) {
  const { push } = context
  push(`'${node.content}'`)
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
