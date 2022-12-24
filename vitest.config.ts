import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: [
      {
        find: /@tiny-vue\/(\w*)/,
        replacement: path.resolve(__dirname, 'packages') + '/$1/src',
      },
    ],
  },
})
