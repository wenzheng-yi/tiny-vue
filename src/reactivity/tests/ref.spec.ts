import { effect } from '../effect'
import { reactive } from '../reactive'
import { isRef, ref, unRef, proxyRefs } from '../ref'

describe('ref', () => {
  it('happy path', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })

  it('should make nested properties reactive', () => {
    const raw = {
      count: 1
    }
    const a = ref(raw)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value.count
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    a.value = raw
    expect(calls).toBe(2)
  })

  it('isRef', () => {
    const raw = ref(1)
    const a = 1
    const user = reactive({
      age: 11
    })
    expect(isRef(raw)).toBe(true)
    expect(isRef(a)).toBe(false)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  })

  it('unRef', () => {
    const raw = ref(1)
    const a = 1
    expect(unRef(raw)).toBe(1)
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })

  it('proxyRefs', () => {
    const user = {
      age: ref(25),
      name: '文正'
    }

    const proxyUser = proxyRefs(user)
    expect(user.age.value).toBe(25)
    expect(proxyUser.age).toBe(25)
    expect(proxyUser.name).toBe('文正')

    proxyUser.age = 26
    expect(user.age.value).toBe(26)
    expect(proxyUser.age).toBe(26)

    proxyUser.age = ref(27)
    expect(user.age.value).toBe(27)
    expect(proxyUser.age).toBe(27)
  })
})