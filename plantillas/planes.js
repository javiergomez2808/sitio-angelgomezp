// Planes con precio "desde", enlace a la demo con ese plan y tabla comparativa plegable.
import { esc, icono, dinero, enlaceWhatsApp, urlDemo } from './util.js';

export function planes(c) {
  const p = c.planes;
  const s = c.sitio;
  return `
  <section class="seccion" id="planes" aria-labelledby="t-planes">
    <div class="contenedor">
      <header class="seccion-cab">
        <h2 id="t-planes">${esc(p.titulo)}</h2>
        <p>${esc(p.subtitulo)}</p>
      </header>
      <ul class="rejilla-planes">
        ${p.items
          .map(
            (pl) => `<li class="tarjeta plan${pl.destacado ? ' plan-destacado' : ''}">
            ${pl.etiqueta ? `<span class="plan-etiqueta">${esc(pl.etiqueta)}</span>` : ''}
            <h3>${esc(pl.nombre)}</h3>
            <p class="plan-para">${esc(pl.para)}</p>
            <p class="plan-precio"><span class="desde">Desde</span> <b>${dinero(pl.precio)}</b> <span class="moneda">${esc(p.moneda)}</span></p>
            <p class="plan-mensual">+ ${dinero(pl.mensual)} ${esc(p.moneda)} al mes</p>
            <ul class="lista-check">${pl.incluye.map((x) => `<li>${icono('ok')}<span>${esc(x)}</span></li>`).join('')}</ul>
            <div class="plan-botones">
              <a class="boton ${pl.destacado ? 'boton-primario' : 'boton-secundario'} boton-bloque" href="${enlaceWhatsApp(s.whatsapp, p.mensajeWhatsApp.replace('{plan}', pl.nombre))}" target="_blank" rel="noopener" data-evento="whatsapp-plan-${esc(pl.id)}">${icono('chat')}<span>${esc(p.botonWhatsApp)}</span></a>
              <a class="enlace" href="${esc(urlDemo(c.demo, { rubro: p.rubroDemo, plan: pl.id, pantalla: 'web' }))}" target="_blank" rel="noopener" data-evento="demo-plan-${esc(pl.id)}">${esc(p.botonDemo)} ${icono('externo')}</a>
            </div>
          </li>`,
          )
          .join('')}
      </ul>
      <p class="nota nota-centro">${esc(p.nota)}</p>

      <details class="comparativa" data-abierto-escritorio>
        <summary>${esc(p.comparativa.titulo)} ${icono('abajo')}</summary>
        <div class="tabla-envoltura">
          <table>
            <caption class="sr">Qué incluye cada plan</caption>
            <thead><tr><th scope="col">Incluye</th>${p.items.map((pl) => `<th scope="col">${esc(pl.nombre)}</th>`).join('')}</tr></thead>
            <tbody>
              ${p.comparativa.filas
                .map(
                  (f) => `<tr><th scope="row">${esc(f.texto)}</th>${f.planes
                    .map((si) => `<td>${si ? `<span class="si">${icono('ok')}<span class="sr">Sí</span></span>` : `<span class="no">${icono('no')}<span class="sr">No</span></span>`}</td>`)
                    .join('')}</tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  </section>`;
}
