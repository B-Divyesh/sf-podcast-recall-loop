import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const publicRoutes = new Set(['/', '/demo', '/app', '/privacy', '/terms']);

export default defineConfig({
  plugins: [{
    name: 'production-route-shells',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.method !== 'GET' || !request.url) return next();
        const url = new URL(request.url, 'http://preview.local');
        const path = url.pathname.replace(/\/$/, '') || '/';
        const acceptsHtml = request.headers.accept?.includes('text/html');
        if (!acceptsHtml || /\.[a-z0-9]+$/i.test(path)) return next();

        if (publicRoutes.has(path)) {
          request.url = path === '/' ? `/index.html${url.search}` : `${path}/index.html${url.search}`;
        } else {
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(readFileSync(resolve(process.cwd(), 'dist/404.html')));
          return;
        }
        next();
      });
    }
  }],
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  server: { port: 4173 },
  preview: { port: 4173 }
});
