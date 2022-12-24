import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
export default {
  input: './packages/vue/src/index.ts',
  output: [
    // cjs -> commonjs
    // 在项目中进行包查找时，cjs情况下默认查找main，esm默认查找module
    {
      format: 'cjs',
      file: './packages/vue/dist/tiny-vue.cjs.js',
    },
    {
      format: 'es',
      file: './packages/vue/dist/tiny-vue.esm.js',
    },
  ],
  plugins: [typescript()],
}
