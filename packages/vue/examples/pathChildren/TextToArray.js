import { h, ref } from '../../dist/tiny-vue.esm.js'

const nextChildren = [h('div', {}, 'A'), h('div', {}, 'B')]
const prevChildren = 'oldChildren'
export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange,
    }
  },
  render() {
    const vnode = this.isChange
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
    return vnode
  },
}
