import { ShapeFlags } from '@tiny-vue/shared'

export function initSlots(instance, children) {
  // 判断是否具名插槽
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

// 处理具名插槽
function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const value = children[key]
    // 使用function是为了向插槽传参
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value) {
  // 判断children是否数组的目的：让用户写slot时，既可以填写数组，也可以填写单个
  return Array.isArray(value) ? value : [value]
}
