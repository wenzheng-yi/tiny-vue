import { getCurrentInstance, h, ref, nextTick } from '../../lib/tiny-vue.esm.js'
export const App = {
  name: 'App',
  setup() {
    const count = ref(0)
    const instance = getCurrentInstance()
    function onClick() {
      for (let i = 0; i < 100; i++) {
        count.value++
      }

      debugger
      console.log(instance)
      nextTick(() => {
        console.log(instance)
      })
    }
    return {
      count,
      onClick,
    }
  },
  render() {
    const button = h('button', { onClick: this.onClick }, '更新')
    const p = h('p', {}, 'count:' + this.count)
    return h('div', {}, [button, p])
  },
}
