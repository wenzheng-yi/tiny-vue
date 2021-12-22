我们在使用 vue3 响应式的时候，一般是直接在 setup 里边运用 reactive 或 ref，例如下边这种写法

````javascript
<script setup>
  let user = reactive({
    age: 1
  })  
  let tree = ref(3)
</script>
````

然后 user、tree 就和 ui 视图形成了响应式关系。我们在改变数据的时候，视图也会随之改变。

但 vue3 的响应式是能够和视图抽离出来的，上面的方法中其实还隐藏了一层 effect 函数。而本文会先介绍 reactive、ref、effect，后边再介绍setup。

#### 回看原始的响应式。

````javascript
let a = 1
let b = a + 1
a = 2
// 我们如果想要 b 随着 a 的变化而改变，可以重新赋值一下，也就是重新执行一遍
b = a + 1
````

再往上一步，我们可以把赋值的过程封装成一个函数，每次 a 改变的时候，就去执行一遍。这也是一种方法呀。

````javascript
let a = 1
let b
function update() {
  b = a + 1
}
a = 2
update()
````

而 vue3 的 reactivity 是怎么做的呢？

````javascript
let a = ref(1)
let b
effect(() => {
  b = a + 1
})
a.value = 2
console.log(b) // 3
````

它会通过 reactive 或 ref 对原始数据做一层代理，借助 effect 收集依赖，在原始数据改变的时候，去触发依赖，也就是自动执行一遍 effect 的函数。

#### 探索 vue3 中 reactive 的实现方式

````javascript
import { track, trigger } from "./effect"
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
````

我们把 effect 相关的方法独立开来，先来看 reactive 方法。

vue3 的 reactive 其实就是返回一个 Proxy , 它在 get 的时候，先运用 `Reflect.get` 返回对应值（相当于 `target[key]`），然后通过 track 方法收集依赖；它在 set 的时候，先运用 `Reflect.set` 设置对应值（相当于 `target[key] = newValue`），然后通过 trigger 触发依赖。

但是，它在这一步中，仅仅是返回了一个 Proxy 代理，收集和触发依赖的过程并没有执行。

接着我们来看 effect 方法。

````javascript
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

  dep.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  dep.forEach(effect => effect.run())
}
````

这里我们借助一个例子来说明

````javascript
let son = reactive({
  age: 25
})
let dad 
effect(() => {
  dad = son.age + 25
})
son.age = 26
console.log(dad) // 51
````

effect 首先接收一个函数。然后 vue3 是运用了一个面向对象的思想，在 effect 中新建一个对象，对象里边把传入的 fn 存起来，在 run 方法中把 this 指向挂载到全局变量 activeEffect 中，紧接着执行一遍传入的函数 fn，也就是执行 `dad = son.age + 25`，执行的过程中其实就触发了 reactive 返回 proxy 中的 get 方法，它会相应执行 effect 里边的 track 方法，收集依赖。

##### 那么收集依赖又是怎么做的呢？

首先，effect 文件中有个公共变量 targetMap ，是 Map 数据类型（允许将对象作为 key ）。

接着看 track 方法。在例子中，它接受的 target 变量，也就是 targetMap 的 key 其实就是 `{ age: 25 }` ，这个 target 再对应一个 Map 数据类型 ( depsMap ) 。

depsMap 中，以原始对象的 key ，即 age 作为自身 key，对应着一个 Set 数据类型（其元素具有唯一性），然后把 effect 中创建的依赖对象 _effect 存进去。

最终的数据结构就类似于这样：

````javascript
targetMap: {
  // key 是对象，value 是 depsMap
  {age: 25} : {
    // key 是对象里边的 key， value 是 dep
    age: [ ...此处存储一个个依赖 ]
  }
}
````

我们继续看例子，effect 里边的逻辑已经走完了，往下执行 `son.age = 26` 。显而易见，这会触发 proxy 代理中的 set 方法，执行 trigger，从 depsMap 中根据 target、key 找到收集依赖的 dep，迭代 dep 执行里边的 run 方法，也即是自动执行了 `dad = son.age + 25` 。

#### 探索 vue3 中 ref 的实现方式

我们知道 reactive 是用来代理复杂数据的，而 ref 一般用于 数字、字符串、布尔值 这类简单数据。那么我们收集依赖的时候，就不需要复杂的 targetMap 了，只需要一个 Set 数据结构就够了。

我们先把 track 和 trigger 中的最后一步提取出来

````javascript
function track(target, key) {
  ......
  // dep.add(activeEffect)
  trackEffects(dep)
}
function trackEffects(dep) {
  dep.add(activeEffect)
}

function trigger(target, key) {
  ......
  // dep.forEach(effect => effect.run())
}
function triggerEffects(dep) {
  dep.forEach(effect => effect.run())
}
````

接着看 ref 的简单实现

````javascript
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
````

再看个简单的例子

````javascript
const apple = ref(1)
let banana
effect(() => {
  banana = apple.value + 2
})
apple.value = 2
console.log(banana) // 4
````

首先看第一步 `const apple = ref(1)`  ，ref 函数内部新建一个 RefImpl 实例，实例内部把传入的值存为私有变量 _value ，同时新建一个存储依赖的 dep 。

get value 的时候收集依赖到 dep 里边，同时返回值；set value 的时候设置新值，同时触发依赖。同样的，这里仅仅返回实例对象，并没有执行 get 和 set 方法。

接着看 effect 里边，和 reactive 那个例子是类似的，先创建一个 ReactiveEffect 对象，再把传入的方法执行一遍。

执行的过程中，读取了 `apple.value` ，触发 RefImpl 的 get 方法。此时，trackEffects 方法会把 effect 新建的 ReactiveEffect 实例对象存储到 RefImpl 自身的 dep 中，这里就不是存储到 effect 文件里边的公共变量 targetMap 了。

接着看下一步 `apple.value = 2` ，触发 RefImpl 的 set 方法，把自己的 dep 拿出来，迭代执行里边的 run 方法。如此便自动执行了 `banana = apple.value + 2`。
