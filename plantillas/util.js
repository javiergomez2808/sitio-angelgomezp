// Utilidades que comparten las plantillas. Todo se ejecuta al construir el sitio (no en el navegador).

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

const fmtDinero = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
export const dinero = (n) => fmtDinero.format(n);

/** Enlace de WhatsApp con mensaje prellenado. */
export const enlaceWhatsApp = (numero, mensaje = '') => `https://wa.me/${numero}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;

/** URL de la demo con rubro, plan y pantalla. */
export function urlDemo(demo, { rubro, plan = demo.planInicial, pantalla } = {}) {
  const u = new URL(demo.urlBase);
  if (rubro) u.searchParams.set('rubro', rubro);
  if (plan) u.searchParams.set('plan', plan);
  const p = demo.pantallas.find((x) => x.id === pantalla);
  return u.toString() + (p ? p.ruta : '');
}

/** Captura de la demo en tres tamaños; el navegador elige la que necesita según la pantalla. */
export const ANCHOS_CAPTURA = [375, 560, 750];
export const srcsetCaptura = (base) => ANCHOS_CAPTURA.map((a) => `${base}-${a}.webp ${a}w`).join(', ');

export function captura({ rubro, pantalla, alt, carga = 'lazy', prioridad = '', tamanos = '(min-width: 900px) 320px, 74vw', clase = '' }) {
  const base = `/capturas/${rubro}-${pantalla}`;
  return `<img${clase ? ` class="${clase}"` : ''} src="${base}-560.webp" srcset="${srcsetCaptura(base)}" sizes="${tamanos}" width="375" height="812" alt="${esc(alt)}" loading="${carga}" decoding="async"${prioridad ? ` fetchpriority="${prioridad}"` : ''}>`;
}

// Íconos de línea (24×24). Se dibujan aquí para no depender de librerías externas.
const P = {
  calendario: '<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
  grafica: '<path d="M3 3v18h18"/><path d="M8 17v-5M13 17V8M18 17v-8"/>',
  porcentaje: '<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  reloj: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
  hoja: '<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z"/><path d="M5 19L14 10"/>',
  tijeras: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/>',
  corazon: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  ok: '<path d="M20 6L9 17l-5-5"/>',
  no: '<path d="M18 12H6"/>',
  externo: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  correo: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  cerrar: '<path d="M18 6L6 18M6 6l12 12"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  ubicacion: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  abajo: '<path d="M6 9l6 6 6-6"/>',
  chat: '<path d="M20.5 11.6a8.4 8.4 0 0 1-12.2 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.6z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .9a3.6 3.6 0 0 1-2.2-2.2l.9-1-1-2z"/>',
};

export function icono(nombre, clase = '') {
  return `<svg class="ico ${clase}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[nombre] || P.ok}</svg>`;
}
