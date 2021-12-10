import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"

class RefImpl {
  private _value: any
  public dep
  private _rawValue: any
  constructor(raw) {
    this._rawValue = raw
    this._value = convert(raw)
    this.dep = new Set()
  }
  get value() {
    // 收集依赖
    trackRefEffects(this)
    return this._value
  }
  set value(newValue) {
    // 一定是先修改了值的，触发依赖
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.dep)
    }
  }
}
function  trackRefEffects(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}
function convert(value) {
  return isObject(value) ? reactive(value) : value
}
export function ref(raw) {
  return new RefImpl(raw)
}