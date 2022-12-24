import {
  h,
  createTextVNode,
  getCurrentInstance,
} from '../../lib/tiny-vue.esm.js'
import { Foo } from './Foo.js'
export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'getCurrentInstance demo')
    const foo = h(Foo)

    return h('div', {}, [app, foo])
  },
  setup() {
    const instance = getCurrentInstance()
    console.log(instance)
    return {}
  },
}
