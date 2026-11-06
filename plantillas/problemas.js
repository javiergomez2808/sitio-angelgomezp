// Problemas que resuelvo, cada uno con su solución en una línea.
import { esc, icono } from './util.js';

export function problemas(c) {
  const p = c.problemas;
  return `
  <section class="seccion" id="problemas" aria-labelledby="t-problemas">
    <div class="contenedor">
      <header class="seccion-cab">
        <h2 id="t-problemas">${esc(p.titulo)}</h2>
        <p>${esc(p.subtitulo)}</p>
      </header>
      <ul class="rejilla-problemas">
        ${p.items
          .map(
            (it) => `<li class="tarjeta problema">
            <span class="problema-ico">${icono(it.icono)}</span>
            <h3>${esc(it.problema)}</h3>
            <p><span class="solucion-etiqueta">${icono('ok')}Solución:</span> ${esc(it.solucion)}</p>
          </li>`,
          )
          .join('')}
      </ul>
    </div>
  </section>`;
}
