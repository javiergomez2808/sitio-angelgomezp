// Toma capturas de pantalla con Edge o Chrome en modo automático (sin ventana). No descarga nada.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const CANDIDATOS = [
  process.env.NAVEGADOR,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

export const NAVEGADOR = CANDIDATOS.find((r) => fs.existsSync(r));

/** Guarda una captura PNG de `url` con el tamaño indicado (en píxeles CSS). */
export function capturar(url, archivo, { ancho, alto, escala = 1, espera = 8000, transparente = false }) {
  if (!NAVEGADOR) throw new Error('No encontré Edge ni Chrome. Indica la ruta con la variable NAVEGADOR.');
  // Perfil nuevo en cada captura: la demo genera sus datos ficticios desde cero
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'captura-'));
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--user-data-dir=${perfil}`,
    `--window-size=${ancho},${alto}`,
    `--force-device-scale-factor=${escala}`,
    `--virtual-time-budget=${espera}`,
    `--screenshot=${archivo}`,
  ];
  if (transparente) args.push('--default-background-color=00000000');
  args.push(url);
  try {
    execFileSync(NAVEGADOR, args, { stdio: 'ignore', timeout: 90000 });
  } finally {
    fs.rmSync(perfil, { recursive: true, force: true, maxRetries: 3 });
  }
  if (!fs.existsSync(archivo)) throw new Error(`No se generó la captura de ${url}`);
}

/**
 * Captura como celular: Edge no permite ventanas de menos de 500 px, así que la página se carga
 * dentro de un marco del ancho exacto y luego se recorta. Devuelve la ruta del PNG recortado.
 */
export async function capturarCelular(url, archivo, { ancho = 375, alto = 812, escala = 2, espera = 9000 } = {}) {
  const sharp = (await import('sharp')).default;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'marco-'));
  const marco = path.join(dir, 'marco.html');
  fs.writeFileSync(
    marco,
    `<!doctype html><html><body style="margin:0;background:#fff"><iframe src="${url.replace(/"/g, '&quot;')}" style="position:fixed;left:0;top:0;width:${ancho}px;height:${alto}px;border:0"></iframe></body></html>`,
  );
  const completo = path.join(dir, 'completo.png');
  try {
    capturar(pathToFileURL(marco).href, completo, { ancho: Math.max(520, ancho), alto, escala, espera });
    await sharp(completo).extract({ left: 0, top: 0, width: ancho * escala, height: alto * escala }).toFile(archivo);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
  }
}
