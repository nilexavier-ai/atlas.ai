import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const page = (route) => resolve(process.cwd(), route, 'index.html');
const routes = ['how-it-works', 'features', 'solutions', 'pricing', 'faq', 'book-demo'];

const cleanPageRoutes = () => ({
  name: 'atlas-clean-page-routes',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      if (routes.some((route) => request.url === `/${route}`)) request.url += '/index.html';
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((request, _response, next) => {
      if (routes.some((route) => request.url === `/${route}`)) request.url += '/index.html';
      next();
    });
  },
});

export default defineConfig({
  plugins: [cleanPageRoutes()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), 'index.html'),
        howItWorks: page('how-it-works'),
        features: page('features'),
        solutions: page('solutions'),
        pricing: page('pricing'),
        faq: page('faq'),
        bookDemo: page('book-demo'),
      },
    },
  },
});
