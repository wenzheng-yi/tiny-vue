export * from '@tiny-vue/runtime-dom'

import { baseCompile } from '@tiny-vue/compiler-core'
import * as runtimeDom from '@tiny-vue/runtime-dom'
import { registerRuntimeCompiler } from '@tiny-vue/runtime-dom'

function compileToFunction(template) {
  const { code } = baseCompile(template)
  const render = new Function('Vue', code)(runtimeDom)
  console.log(render)
  return render
}

registerRuntimeCompiler(compileToFunction)
