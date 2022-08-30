import { h } from '../../lib/tiny-vue.esm.js'
import { Foo } from './Foo.js'
export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'App')
    const foo = h(
      Foo,
      {},
      {
        header: ({type}) => h('p', {}, 'header ' + type),
        footer: () => h('p', {}, 'footer'),
      }
    )
    // const foo = h(Foo, {}, h('p', {}, 'this is second slot'))

    return h('div', {}, [app, foo])
  },
  setup() {
    return {}
  },
}
