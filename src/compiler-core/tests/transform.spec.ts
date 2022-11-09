import { NodeTypes } from '../src/ast'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'

describe('transform', () => {
  it('happy path', () => {
    const ast = baseParse('<div>hi,{{message}}</div>')
    const plugins = [
      (node) => {
        if (node.type === NodeTypes.TEXT) {
          node.content = node.content + 'tiny-vue'
        }
      },
    ]
    transform(ast, {
      nodeTransforms: plugins,
    })

    const nodeText = ast.children[0].children[0]
    expect(nodeText.content).toBe('hi,tiny-vue')
  })
})
