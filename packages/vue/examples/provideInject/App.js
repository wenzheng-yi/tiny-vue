import { h, provide, inject } from '../../dist/tiny-vue.esm.js'

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(ProviderTwo)])
  },
}

const ProviderTwo = {
  name: 'ProviderTwo',
  setup() {
    provide('foo', 'fooTwo')
    const foo = inject('foo')
    return { foo }
  },
  render() {
    return h('div', {}, [
      h('p', {}, `ProviderTwo foo:${this.foo}`),
      h(Consumer),
    ])
  },
}

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    const baz = inject('baz', 'bazDefault')
    const fun = inject('fun', () => 'funVal')
    return {
      foo,
      bar,
      baz,
      fun,
    }
  },
  render() {
    return h(
      'div',
      {},
      `Consumer: - ${this.foo} - ${this.bar} - ${this.baz} - ${this.fun}`
    )
  },
}

export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'provideInject'), h(Provider)])
  },
}
