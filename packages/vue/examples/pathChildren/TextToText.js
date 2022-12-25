import { h, ref } from '../../dist/tiny-vue.esm.js'
const prevChildren = 'oldChild'
const nextChildren = 'nexChild'

export default {
  name: 'TextToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return {
      isChange,
    }
  },
  render() {
    return this.isChange
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  },
}
