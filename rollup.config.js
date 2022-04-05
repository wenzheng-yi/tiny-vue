import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
export default {
  input: './src/index.ts',
  output: [
    // cjs -> commonjs
    // 在项目中进行包查找时，cjs情况下默认查找main，esm默认查找module
    {
      format: 'cjs',
      file: pkg.main
    },
    {
      format: 'es',
      file: pkg.module
    }
  ],
  plugins: [
    typescript()
  ]
}