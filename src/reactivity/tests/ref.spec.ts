import { effect } from '../effect'
import { ref } from '../ref'

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
})