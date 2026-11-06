// Arma la página completa a partir de content.json. Se usa al construir el sitio (y en modo desarrollo).
import { head } from './seo.js';
import { barra, portada } from './encabezado.js';
import { problemas } from './problemas.js';
import { vitrina } from './vitrina.js';
import { planes } from './planes.js';
import { caso, proceso, sobreMi, preguntas, contacto, pie } from './resto.js';
import { esc, icono } from './util.js';

export function renderPagina(c) {
  return {
    head: head(c),
    cuerpo: `${barra(c)}
    <main id="contenido">
      ${portada(c)}
      ${problemas(c)}
      ${vitrina(c)}
      ${planes(c)}
      ${caso(c)}
      ${proceso(c)}
      ${sobreMi(c)}
      ${preguntas(c)}
      ${contacto(c)}
    </main>
    ${pie(c)}`,
  };
}

export function render404(c) {
  const s = c.sitio;
  return {
    head: `<title>Página no encontrada · ${esc(s.nombre)}</title><meta name="robots" content="noindex"><meta name="theme-color" content="${esc(s.colorTema)}">`,
    cuerpo: `
    <main class="error-404" id="contenido">
      <span class="marca-logo marca-grande" aria-hidden="true">${esc(s.iniciales)}</span>
      <h1>Esta página no existe</h1>
      <p>Puede que el enlace esté mal escrito o que la página ya no esté disponible.</p>
      <a class="boton boton-primario boton-grande" href="/">${icono('flecha')}<span>Volver al inicio</span></a>
    </main>`,
  };
}
