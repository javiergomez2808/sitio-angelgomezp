// Vitrina de la demo: celular con capturas reales que se cambia por rubro y pantalla;
// en computadora, "Probar aquí" carga la demo real dentro del celular.
import { esc, icono, captura, urlDemo } from './util.js';

export function vitrina(c) {
  const d = c.demo;
  const rubro = d.rubros[0];
  const pantalla = d.pantallas[0];
  // Datos para el JavaScript de la página (cambiar rubro y pantalla sin recargar)
  const datos = {
    urlBase: d.urlBase,
    plan: d.planInicial,
    rubros: d.rubros.map((r) => ({ slug: r.slug, nombre: r.nombre, incluye: r.incluye })),
    pantallas: d.pantallas.map((p) => ({ id: p.id, nombre: p.nombre, ruta: p.ruta, frase: p.frase })),
  };

  return `
  <section class="seccion seccion-demo" id="demo" aria-labelledby="t-demo">
    <div class="contenedor">
      <header class="seccion-cab">
        <p class="antetitulo">Demo en vivo</p>
        <h2 id="t-demo">${esc(d.titulo)}</h2>
        <p>${esc(d.subtitulo)}</p>
      </header>

      <div class="vitrina" data-vitrina>
        <div class="vitrina-controles">
          <p class="selector-etiqueta" id="et-rubro">Tipo de negocio</p>
          <div class="selector" role="radiogroup" aria-labelledby="et-rubro">
            ${d.rubros
              .map(
                (r, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-rubro="${esc(r.slug)}">${icono(r.icono)}<span>${esc(r.nombre)}</span></button>`,
              )
              .join('')}
          </div>
          <p class="selector-etiqueta" id="et-pantalla">¿Qué quieres ver?</p>
          <div class="selector selector-pantallas" role="radiogroup" aria-labelledby="et-pantalla">
            ${d.pantallas
              .map((p, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-pantalla="${esc(p.id)}">${esc(p.nombre)}</button>`)
              .join('')}
          </div>
        </div>

        <div class="vitrina-info">
          <p class="vitrina-frase" data-frase aria-live="polite">${esc(pantalla.frase)}</p>
          <ul class="lista-check" data-incluye>
            ${rubro.incluye.map((x) => `<li>${icono('ok')}<span>${esc(x)}</span></li>`).join('')}
          </ul>
          <div class="botones">
            <button type="button" class="boton boton-primario solo-escritorio" data-probar data-evento="demo-probar">${icono('play')}<span>${esc(d.botonProbar)}</span></button>
            <a class="boton boton-secundario" data-abrir href="${esc(urlDemo(d, { rubro: rubro.slug, pantalla: pantalla.id }))}" target="_blank" rel="noopener" data-evento="demo-abrir">${icono('externo')}<span>${esc(d.botonAbrir)}</span></a>
          </div>
          <p class="nota">${esc(d.aviso)}</p>
        </div>

        <div class="vitrina-visual">
          <div class="telefono">
            <div class="telefono-pantalla" data-pantalla-telefono>
              <div class="carrusel" data-carrusel tabindex="0" aria-label="Capturas de la demo. Desliza para ver más.">
                ${d.pantallas
                  .map(
                    (p) => `<figure class="carrusel-item" data-item="${esc(p.id)}">${captura({
                      rubro: rubro.slug,
                      pantalla: p.id,
                      alt: `Captura de la demo de ${rubro.nombre.toLowerCase()}: ${p.nombre.toLowerCase()}`,
                    })}</figure>`,
                  )
                  .join('')}
              </div>
            </div>
          </div>
          <div class="puntos" data-puntos>
            ${d.pantallas.map((p, i) => `<button type="button" aria-label="Ver ${esc(p.nombre)}" ${i === 0 ? 'aria-current="true"' : ''} data-punto="${esc(p.id)}"></button>`).join('')}
          </div>
          <button type="button" class="boton boton-texto oculto" data-cerrar-demo>${icono('cerrar')}<span>Volver a las capturas</span></button>
        </div>
      </div>

      <h3 class="subtitulo-seccion">Demos por tipo de negocio</h3>
      <ul class="rejilla-rubros">
        ${d.rubros
          .map(
            (r) => `<li class="tarjeta rubro">
            <div class="rubro-imagen">${captura({ rubro: r.slug, pantalla: 'agenda', alt: '', tamanos: '(min-width: 900px) 330px, 80vw' })}</div>
            <div class="rubro-cuerpo">
              <h4>${icono(r.icono)}${esc(r.nombre)}</h4>
              <p>${esc(r.descripcion)}</p>
              <ul class="lista-check lista-chica">${r.incluye.map((x) => `<li>${icono('ok')}<span>${esc(x)}</span></li>`).join('')}</ul>
              <a class="boton boton-secundario boton-bloque" href="${esc(urlDemo(d, { rubro: r.slug, pantalla: 'web' }))}" target="_blank" rel="noopener" data-evento="demo-tarjeta-${esc(r.slug)}">${icono('externo')}<span>Abrir demo de ${esc(r.nombre.split(' /')[0].toLowerCase())}</span></a>
            </div>
          </li>`,
          )
          .join('')}
      </ul>
    </div>
    <script type="application/json" id="datos-demo">${JSON.stringify(datos).replace(/</g, '\\u003c')}</script>
  </section>`;
}
