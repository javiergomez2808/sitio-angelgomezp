import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPagina, render404 } from './plantillas/index.js';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const RUTA_CONTENIDO = path.join(RAIZ, 'content.json');
const leerContenido = () => JSON.parse(fs.readFileSync(RUTA_CONTENIDO, 'utf8'));

/** Escribe el contenido de content.json dentro del HTML al construir: la página llega lista (rápida y buena para SEO). */
function sitioDesdeContenido() {
  return {
    name: 'sitio-desde-content-json',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const c = leerContenido();
        const pagina = ctx.filename.endsWith('404.html') ? render404(c) : renderPagina(c);
        return html.replace('<!--HEAD-->', pagina.head).replace('<!--CUERPO-->', pagina.cuerpo);
      },
    },
    configureServer(server) {
      // Al guardar content.json se recarga la página en modo desarrollo
      server.watcher.add(RUTA_CONTENIDO);
      server.watcher.on('change', (archivo) => {
        if (path.resolve(archivo) === RUTA_CONTENIDO) server.ws.send({ type: 'full-reload' });
      });
    },
    generateBundle() {
      const { sitio } = leerContenido();
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nSitemap: ${sitio.url}/sitemap.xml\n` });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${sitio.url}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`,
      });
    },
  };
}

/** En la página principal el CSS va dentro del HTML: una descarga menos antes de mostrar la página. */
function cssEnLinea() {
  return {
    name: 'css-en-linea',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle || !ctx.filename.endsWith('index.html')) return html;
        return html.replace(/<link rel="stylesheet"[^>]*href="\/([^"]+\.css)"[^>]*>/g, (etiqueta, archivo) => {
          const recurso = ctx.bundle[archivo];
          return recurso && recurso.type === 'asset' ? `<style>${recurso.source}</style>` : etiqueta;
        });
      },
    },
  };
}

export default defineConfig({
  root: RAIZ,
  base: '/',
  plugins: [sitioDesdeContenido(), cssEnLinea()],
  build: {
    rollupOptions: { input: { main: path.join(RAIZ, 'index.html'), noEncontrada: path.join(RAIZ, '404.html') } },
  },
});
