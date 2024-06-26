import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('wangeditor')) {
            return 'vendor-wangeditor';
          }
        }
      }
    }
  },
  plugins: [
    vue(),
    wasm(),
    topLevelAwait(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useMessage',
            'NButton',
            'NPopconfirm',
            'NIcon',
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        disableDevLogs: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: '藏雪のMail',
        short_name: '藏雪のMail',
        description: '藏雪のMail - Temporary Email',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
  }
})
