import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app-v1.js',
        assetFileNames: asset => asset.name?.endsWith('.css') ? 'assets/app-v1.css' : 'assets/[name]-[hash][extname]'
      }
    }
  },
  server: { port: 4173 },
  preview: { port: 4173 }
});
