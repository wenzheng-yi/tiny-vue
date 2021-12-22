let activeEffect;
class ReactiveEffect {
  constructor(fn) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    this._fn()
  }
}

function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

const targetMap = new Map()
function track(target, key) {
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
function trackEffects(dep){
  dep.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  triggerEffects(dep)
}
function triggerEffects(dep) {
  dep.forEach(effect => effect.run())
}

function reactive(raw){
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)

      // 依赖收集
      track(target, key)
      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)

      // 触发依赖
      trigger(target, key)
      return res
    }
  })
}

const son = reactive({
  user: 25
})
let dad
effect(() => {
  dad = son.age + 25
})
son.age = 26

console.log(dad)

function ref(raw) {
  return new RefImpl(raw)
}
class RefImpl {
  constructor(raw) {
    this._value = raw
    this.dep = new Set()
  }
  get value() {
    trackEffects(this.dep)
    return this._value
  }
  set value(newValue) {
    this._value = newValue
    triggerEffects(this.dep)
  }
}

const apple = ref(1)
let banana
effect(() => {
  banana = apple.value + 2
})
apple.value = 2
console.log(banana)
apple.value = 3
console.log(banana)