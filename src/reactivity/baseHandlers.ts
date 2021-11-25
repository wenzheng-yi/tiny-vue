import { track, trigger } from "./effect"
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
export const mutableHandlers = {
  get,
  set
}
export const readonlyHandlers = {
  get:readonlyGet,
  set(target, key, value) {
    console.warn(`key ${key} can not be set, beacuse target is reaconly`, target)
    return true
  }
}

function createGetter(isReadonly = false) {
  return function (target, key) {
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}