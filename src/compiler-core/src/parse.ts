import { NodeTypes } from './ast'
const enum TagType {
  START,
  END,
}
export function baseParse(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context, []))
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
function parseChildren(context, ancestors): any {
  const nodes: any = []

  while (!isEnd(context, ancestors)) {
    let node
    const s = context.source
    if (s.startsWith('{{')) {
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }
    if (!node) {
      node = parseText(context)
    }
    nodes.push(node)
  }

  return nodes
}
function isEnd(context, ancestors) {
  const s = context.source
  // 1、遇到结束标签
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const tag = ancestors[i].tag
    if (startsWithEndTagOpen(s, tag)) {
      return true
    }
  }
  // 2、source没有值的时候
  return !s
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
function parseElement(context: any, ancestors) {
  const element: any = parseTag(context, TagType.START)
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.END)
  } else {
    throw new Error(`缺少结束标签${element.tag}`)
  }

  return element
}

function startsWithEndTagOpen(source: any, tag: any) {
  return (
    source.startsWith('</') &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  )
}

function parseTag(context: any, type: TagType) {
  // 1. 解析tag
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]
  // 2. 删除处理完成的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)
  if (type === TagType.END) return
  return {
    type: NodeTypes.ELEMENT,
    tag,
  }
}
function parseText(context: any): any {
  let endIndex = context.source.length
  let endTokens = ['<', '{{']
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i])
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
  }
  const content = parseTextData(context, endIndex)

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
