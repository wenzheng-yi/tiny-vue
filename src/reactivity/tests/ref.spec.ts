import { effect } from '../effect'
import { reactive } from '../reactive'
import { isRef, ref, unRef } from '../ref'

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
})