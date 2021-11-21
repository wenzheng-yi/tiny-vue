import { reactive } from '../reactive';
import { effect, stop } from '../effect';
describe('effect', () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    })

    let nextAge;
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    user.age++
    expect(nextAge).toBe(12)
  })

  it("return runner", () => {
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })

  it("scheduler", () => {
    // 1、 通过 effect 的第二个参数，给定一个 scheduler 的 fn
    // 2、 effect 第一次执行的时候，会执行fn
    // 3、 当响应式对象set update 的时候不会执行 fn, 而是执行 scheduler
    // 4、 当执行 runner 的时候，会再次的执行 fn
    let dummy
    let run: any
    const scheduler = jest.fn(() => [
      run = runner
    ])
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // // should not run yet
    expect(dummy).toBe(1)
    // // manually run
    run()
    // // should have run 
    expect(dummy).toBe(2)
  })

  it("stop", () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })

  it("onStop", () => {
    const obj = reactive({
      foo: 1
    })
    const onStop = jest.fn()
    let dummy
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop
      }
    )

    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})