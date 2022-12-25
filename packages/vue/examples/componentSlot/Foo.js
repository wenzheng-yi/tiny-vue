import { h, renderSlots } from '../../dist/tiny-vue.esm.js'
export const Foo = {
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')
    console.log(this.$slots)
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        type: 'good',
      }),
      foo,
      renderSlots(this.$slots, 'footer'),
    ])
  },
}
