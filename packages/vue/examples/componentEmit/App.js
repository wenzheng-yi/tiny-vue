import { h } from '../../dist/tiny-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['yellow', 'green'],
      },
      [
        h('div', {}, 'hi,' + this.msg),
        h(Foo, {
          onAdd(a, b) {
            console.log('来自foo组件的onAdd事件', a, b)
          },
          onAddFoo(c, d) {
            console.log('onAddFoo', c, d)
          },
        }),
      ]
    )
  },

  setup() {
    return {
      msg: 'tiny-vue,ni hao',
    }
  },
}
