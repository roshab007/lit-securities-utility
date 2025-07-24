import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'SecuritiesUtility',
      formats: ['es'],
      fileName: fmt => `index.js`
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['fuzzysort']
    }
  },
  plugins: [dts()]
})
