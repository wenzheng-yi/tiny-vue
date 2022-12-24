import { isReadonly, shallowReadonly } from '../src/reactive'

describe('shallowReadonly', () => {
  test('should not mak non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })

  it('wran when call set', () => {
    console.warn = vi.fn()
    const user = shallowReadonly({
      age: 10,
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})
