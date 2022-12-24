import { camelize, toHandlerKey } from '@tiny-vue/shared'

// 执行子组件的emit方法，触发父组件props中的注册事件
export function emit(instance, event, ...args) {
  console.log('emit', event)

  const { props } = instance

  // 将传入的event名称转化为props中的注册事件名
  const handlerKeyName = toHandlerKey(camelize(event))
  const handler = props[handlerKeyName]
  handler && handler(...args)
}
