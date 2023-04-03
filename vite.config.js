import { fileURLToPath, URL } from 'node:url'

import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const vueDocsPlugin = {
  name: 'vue-docs',
  transform(_code, id) {
    if (!/vue&type=docs/.test(id)) return
    return `export default ''`
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDocsPlugin,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/entry.js'),
      name: '@openclinical/proformajs-vue',
      // the proper extensions will be added
      fileName: 'proformajs-vue',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', '@openclinical/proformajs', 'moment', 'file-saver', 'marked', 'dompurify', '@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          moment: 'Moment',
          'file-saver': 'FileSaver',
          dompurify: 'createDOMPurify',
          marked: 'marked',
          '@openclinical/proformajs': 'proformajs',
          '@fortawesome/fontawesome-svg-core': 'library',
          '@fortawesome/free-solid-svg-icons': 'FontAwesomeIcons',
          '@fortawesome/vue-fontawesome': 'FontAwesomeIcon'
        },
      },
    }
  },
})
