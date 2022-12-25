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
        onClick() {
          console.log('click')
        },
        onMousedown() {
          console.log('mousedown')
        },
      },
      [h('div', {}, 'hi,' + this.msg), h(Foo, { count: 1 })]
      // [
      //   h("p", { class: "yellow" }, "你好"),
      //   h("p", { class: "green" }, "tiny-vue")
      // ]
    )
  },

  setup() {
    return {
      msg: 'tiny-vue,ni hao',
    }
  },
}
