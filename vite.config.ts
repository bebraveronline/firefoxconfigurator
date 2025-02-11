import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.ts'),
        success: resolve(__dirname, 'src/assets/success.js'),
        error: resolve(__dirname, 'src/assets/error.js')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          if (chunkInfo.name === 'success') {
            return 'assets/success.js';
          }
          if (chunkInfo.name === 'error') {
            return 'assets/error.js';
          }
          return 'assets/[name]-[hash].js';
        },
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  base: './',
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});