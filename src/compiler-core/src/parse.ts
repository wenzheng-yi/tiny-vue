import { NodeTypes } from './ast'
const enum TagType {
  START,
  END,
}
export function baseParse(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context))
}
function createParserContext(content: string) {
  return {
    source: content,
  }
}
function createRoot(children) {
  return {
    children,
  }
}
function parseChildren(context): any {
  const nodes: any = []
  let node
  const s = context.source
  if (s.startsWith('{{')) {
    node = parseInterpolation(context)
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  }
  if (!node) {
    node = parseText(context)
  }
  nodes.push(node)
  return nodes
}
function parseInterpolation(context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  const closeIndex = context.source.indexOf(closeDelimiter)
  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()
  advanceBy(context, closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  }
}

function advanceBy(context: any, length) {
  context.source = context.source.slice(length)
}
function parseElement(context: any) {
  const element = parseTag(context, TagType.START)
  parseTag(context, TagType.END)

  return element
}
function parseTag(context: any, type: TagType) {
  // 1. 解析tag
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]
  // 2. 删除处理完成的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)
  console.log(context.source)
  if (type === TagType.END) return
  return {
    type: NodeTypes.ELEMENT,
    tag,
  }
}
function parseText(context: any): any {
  const content = parseTextData(context, context.source.length)
  return {
    type: NodeTypes.TEXT,
    content,
  }
}
function parseTextData(context: any, length) {
  const content = context.source.slice(0, length)
  advanceBy(context, content.length)
  return content
}
