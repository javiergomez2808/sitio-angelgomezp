// Toma capturas reales de la demo (375×812, al doble de resolución) para cada rubro y pantalla de content.json
// y las guarda en public/capturas en WebP (375, 560 y 750 px de ancho).
//
// Uso:  npm run capturas                       (usa la URL de la demo de content.json)
//       npm run capturas -- http://localhost:5173/   (otra dirección, por ejemplo la demo en tu computadora)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { capturarCelular } from './navegador.mjs';

const contenido = JSON.parse(fs.readFileSync('content.json', 'utf8'));
const { demo } = contenido;
const base = process.argv[2] || demo.urlBase;
const salida = path.resolve('public/capturas');
const temporal = path.resolve('.capturas-tmp');
fs.mkdirSync(salida, { recursive: true });
fs.mkdirSync(temporal, { recursive: true });

let n = 0;
for (const rubro of demo.rubros) {
  for (const pantalla of demo.pantallas) {
    const u = new URL(base);
    u.searchParams.set('rubro', rubro.slug);
    u.searchParams.set('plan', demo.planInicial);
    const url = u.toString() + pantalla.ruta;
    const png = path.join(temporal, `${rubro.slug}-${pantalla.id}.png`);
    process.stdout.write(`Capturando ${rubro.slug} · ${pantalla.id}… `);
    await capturarCelular(url, png);
    const nombre = path.join(salida, `${rubro.slug}-${pantalla.id}`);
    await sharp(png).resize(750, 1624, { fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(`${nombre}-750.webp`);
    await sharp(png).resize(560, 1213, { fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(`${nombre}-560.webp`);
    await sharp(png).resize(375, 812, { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(`${nombre}-375.webp`);
    console.log('listo');
    n++;
  }
}
fs.rmSync(temporal, { recursive: true, force: true });
console.log(`\n${n} capturas guardadas en public/capturas`);
