import { h, ref } from '../../dist/tiny-vue.esm.js'

const nextChildren = 'newChildren'
const prevChildren = [h('div', {}, 'A'), h('div', {}, 'B')]
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
