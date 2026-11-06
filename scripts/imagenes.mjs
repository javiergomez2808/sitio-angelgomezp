// Genera la imagen para compartir (Open Graph, 1200×630) y los íconos con las iniciales,
// usando los textos de content.json, la tipografía del sitio y una captura real de la demo.
//
// Uso: npm run imagenes   (después de npm run capturas)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { capturar } from './navegador.mjs';

const c = JSON.parse(fs.readFileSync('content.json', 'utf8'));
const s = c.sitio;
const publico = path.resolve('public');
const url = (archivo) => pathToFileURL(path.join(publico, archivo)).href;
const esc = (t) => String(t).replace(/[&<>"]/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[x]);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'imagenes-'));

const estilosBase = `
  @font-face { font-family: 'Fraunces'; src: url('${url('fuentes/fraunces.woff2')}') format('woff2'); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; }`;

// ---------- Imagen para compartir ----------
const captura = `capturas/${c.encabezado.rubroCaptura}-${c.encabezado.pantallaCaptura}-750.webp`;
const og = `<!doctype html><html><head><meta charset="utf-8"><style>${estilosBase}
  body { width: 1200px; height: 630px; background: #FAF7F2; color: #1D2321; position: relative; overflow: hidden; }
  .texto { position: absolute; left: 72px; top: 72px; width: 640px; }
  .marca { display: flex; align-items: center; gap: 16px; font-size: 28px; font-weight: 600; margin-bottom: 40px; }
  .logo { width: 64px; height: 64px; border-radius: 18px; background: #1F6F66; color: #fff; display: grid; place-items: center; font-family: 'Fraunces'; font-weight: 650; font-size: 28px; }
  h1 { font-family: 'Fraunces'; font-weight: 600; font-size: 64px; line-height: 1.08; letter-spacing: -0.02em; margin-bottom: 28px; }
  p { font-size: 27px; color: #4B5652; line-height: 1.4; }
  .url { position: absolute; left: 72px; bottom: 56px; font-size: 24px; font-weight: 700; color: #1F6F66; }
  .fondo { position: absolute; right: 60px; top: 70px; width: 380px; height: 640px; border-radius: 56px; background: #F1EADF; }
  .tel { position: absolute; right: 110px; top: 110px; width: 280px; height: 606px; padding: 10px; border-radius: 44px; background: #fff; border: 1px solid #D9CFBF; box-shadow: 0 24px 60px rgba(29,35,33,.18); }
  .tel img { width: 100%; height: 100%; object-fit: cover; object-position: top; border-radius: 34px; display: block; }
</style></head><body>
  <div class="fondo"></div>
  <div class="tel"><img src="${url(captura)}"></div>
  <div class="texto">
    <div class="marca"><span class="logo">${esc(s.iniciales)}</span>${esc(s.nombre)}</div>
    <h1>${esc(c.encabezado.titulo)}</h1>
    <p>Páginas web con reservas, finanzas claras y WhatsApp automático para negocios en ${esc(s.ciudad)}.</p>
  </div>
  <div class="url">${esc(new URL(s.url).host)} · Prueba la demo en vivo</div>
</body></html>`;
fs.writeFileSync(path.join(dir, 'og.html'), og);
const ogPng = path.join(dir, 'og.png');
capturar(pathToFileURL(path.join(dir, 'og.html')).href, ogPng, { ancho: 1200, alto: 630, escala: 1, espera: 4000 });
await sharp(ogPng).extract({ left: 0, top: 0, width: 1200, height: 630 }).png({ compressionLevel: 9, palette: false }).toFile(path.join(publico, 'og.png'));
console.log('og.png listo');

// ---------- Íconos con las iniciales ----------
const icono = (redondeo) => `<!doctype html><html><head><meta charset="utf-8"><style>${estilosBase}
  html, body { background: transparent; }
  .i { width: 512px; height: 512px; border-radius: ${redondeo}px; background: #1F6F66; color: #fff; display: grid; place-items: center;
       font-family: 'Fraunces'; font-weight: 650; font-size: 250px; letter-spacing: -0.01em; line-height: 1; padding-bottom: 18px; }
</style></head><body><div class="i">${esc(s.iniciales)}</div></body></html>`;

for (const [nombre, redondeo, tamano] of [
  ['favicon-32.png', 112, 32],
  ['apple-touch-icon.png', 0, 180],
  ['icono-512.png', 112, 512],
]) {
  const html = path.join(dir, `${nombre}.html`);
  fs.writeFileSync(html, icono(redondeo));
  const png = path.join(dir, `${nombre}.png`);
  capturar(pathToFileURL(html).href, png, { ancho: 520, alto: 512, escala: 1, espera: 3000, transparente: true });
  await sharp(png).extract({ left: 0, top: 0, width: 512, height: 512 }).resize(tamano, tamano).png().toFile(path.join(publico, nombre));
  console.log(`${nombre} listo`);
}

// Favicon vectorial (se ve nítido en cualquier tamaño)
fs.writeFileSync(
  path.join(publico, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1F6F66"/><text x="32" y="43" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-weight="700" fill="#fff">${esc(s.iniciales)}</text></svg>\n`,
);
console.log('favicon.svg listo');
fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
