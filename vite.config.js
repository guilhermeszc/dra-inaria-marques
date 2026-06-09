import { defineConfig } from 'vite'

export default defineConfig({
  base: '/dra-inaria-marques/',
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['framer-motion', 'embla-carousel'],
        },
      },
    },
  },
})
