import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        enSavoirPlus: resolve(__dirname, 'en-savoir-plus.html'),
        mentions: resolve(__dirname, 'mentions-legales.html'),
        confidentialite: resolve(__dirname, 'politique-confidentialite.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
