import { extend } from '../shared'

let activeEffect;
let shouldTrack;

class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  onStop?: () => void
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    if (!this.active) {
      return this._fn();
    }

    shouldTrack = true
    activeEffect = this

    const result = this._fn()
    shouldTrack = false

    return result
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  // TODO 为什么把length设为0
  // 把 effect.deps 清空
  effect.deps.length = 0
}

const targetMap = new Map()
export function track(target, key) {
  if (!isTracking()) return
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  trackEffects(dep)
}
export function trackEffects(dep) {
  // 看看 dep 之前有没有添加过，添加过的话，那么就不添加了
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  triggerEffects(dep)
}
export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn, options: any = {}) {
  // fn
  const { scheduler } = options
  const _effect = new ReactiveEffect(fn, scheduler)

  extend(_effect, options)
  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}