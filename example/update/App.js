import { h, ref } from '../../lib/tiny-vue.esm.js'
export const App = {
  name: 'App',
  setup() {
    const count = ref(0)
    function onClick() {
      count.value++
    }

    const props = ref({
      foo: 'foo',
      bar: 'bar',
    })
    function setNewFoo() {
      props.value.foo = 'new-foo'
    }
    function setNullFoo() {
      props.value.foo = null
    }
    function delBar() {
      props.value = {
        foo: 'foo',
      }
    }
    return {
      count,
      onClick,
      setNewFoo,
      setNullFoo,
      delBar,
      props,
    }
  },
  render() {
    return h(
      'div',
      {
        id: 'root',
        ...this.props,
      },
      [
        h('div', {}, 'count:' + this.count),
        h(
          'button',
          {
            onClick: this.onClick,
          },
          'click'
        ),
        h(
          'button',
          {
            onClick: this.setNewFoo,
          },
          'new-foo'
        ),
        h(
          'button',
          {
            onClick: this.setNullFoo,
          },
          'foo-undefined'
        ),
        h(
          'button',
          {
            onClick: this.delBar,
          },
          'delBar'
        ),
      ]
    )
  },
}
