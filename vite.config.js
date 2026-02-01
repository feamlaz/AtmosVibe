import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/AtmosVibe/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].mjs',
        chunkFileNames: 'assets/[name].mjs',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
