// Caso real, cómo trabajo, sobre mí, preguntas frecuentes, contacto, pie y botón flotante.
import { esc, icono, enlaceWhatsApp } from './util.js';

export function caso(c) {
  const k = c.caso;
  const nombre = k.mostrarNombre ? k.nombreReal : k.nombreAnonimo;
  // Mientras sea un ejemplo se dice claramente: nunca se presenta como caso real.
  const etiqueta = k.esEjemplo ? 'Caso de ejemplo' : k.etiqueta;
  return `
  <section class="seccion seccion-caso" id="caso" aria-labelledby="t-caso">
    <div class="contenedor">
      <div class="caso tarjeta">
        <header class="caso-cab">
          <p class="antetitulo">${esc(etiqueta)} · ${esc(nombre)}</p>
          <h2 id="t-caso">${esc(k.titulo)}</h2>
        </header>
        <div class="caso-antes-despues">
          <div class="caso-bloque caso-antes"><h3>${esc(k.antes.titulo)}</h3><p>${esc(k.antes.texto)}</p></div>
          <span class="caso-flecha" aria-hidden="true">${icono('flecha')}</span>
          <div class="caso-bloque caso-despues"><h3>${esc(k.despues.titulo)}</h3><p>${esc(k.despues.texto)}</p></div>
        </div>
        <ul class="caso-resultados">
          ${k.resultados.map((r) => `<li><b>${esc(r.valor)}</b><span>${esc(r.texto)}</span></li>`).join('')}
        </ul>
        ${!k.esEjemplo && k.cita?.texto ? `<blockquote class="caso-cita"><p>“${esc(k.cita.texto)}”</p><cite>${esc(k.cita.autor)}</cite></blockquote>` : ''}
        ${k.esEjemplo ? '<p class="nota">Cifras ilustrativas de un proyecto típico.</p>' : ''}
      </div>
    </div>
  </section>`;
}

export function proceso(c) {
  const p = c.proceso;
  return `
  <section class="seccion" id="proceso" aria-labelledby="t-proceso">
    <div class="contenedor">
      <header class="seccion-cab"><h2 id="t-proceso">${esc(p.titulo)}</h2><p>${esc(p.subtitulo)}</p></header>
      <ol class="pasos">
        ${p.pasos.map((x, i) => `<li class="paso"><span class="paso-num" aria-hidden="true">${i + 1}</span><h3>${esc(x.titulo)}</h3><p>${esc(x.texto)}</p></li>`).join('')}
      </ol>
    </div>
  </section>`;
}

export function sobreMi(c) {
  const m = c.sobreMi;
  const foto = m.foto
    ? `<img class="foto" src="${esc(m.foto)}" width="320" height="320" alt="Foto de ${esc(c.sitio.nombre)}" loading="lazy" decoding="async">`
    : `<div class="foto foto-vacia" role="img" aria-label="${esc(c.sitio.nombre)}">${esc(c.sitio.iniciales)}</div>`;
  return `
  <section class="seccion" id="sobre-mi" aria-labelledby="t-sobre">
    <div class="contenedor sobre-mi">
      ${foto}
      <div>
        <h2 id="t-sobre">${esc(m.titulo)}</h2>
        <p class="sobre-texto">${esc(m.parrafo)}</p>
        <ul class="lista-check">${m.datos.map((x) => `<li>${icono('ok')}<span>${esc(x)}</span></li>`).join('')}</ul>
      </div>
    </div>
  </section>`;
}

export function preguntas(c) {
  const q = c.preguntas;
  return `
  <section class="seccion" id="preguntas" aria-labelledby="t-preguntas">
    <div class="contenedor contenedor-angosto">
      <header class="seccion-cab"><h2 id="t-preguntas">${esc(q.titulo)}</h2></header>
      <div class="acordeon">
        ${q.items.map((x) => `<details class="pregunta"><summary><span>${esc(x.pregunta)}</span>${icono('abajo')}</summary><p>${esc(x.respuesta)}</p></details>`).join('')}
      </div>
    </div>
  </section>`;
}

export function contacto(c) {
  const k = c.contacto;
  const s = c.sitio;
  return `
  <section class="seccion seccion-contacto" id="contacto" aria-labelledby="t-contacto">
    <div class="contenedor contenedor-angosto">
      <div class="contacto tarjeta" data-contacto data-numero="${esc(s.whatsapp)}" data-base="${esc(s.mensajeWhatsApp)}" data-con-tipo="${esc(k.mensajeConTipo)}">
        <h2 id="t-contacto">${esc(k.titulo)}</h2>
        <p>${esc(k.subtitulo)}</p>
        <fieldset class="tipos">
          <legend>${esc(k.etiquetaTipos)}</legend>
          ${k.tiposNegocio
            .map((t) => `<label class="tipo"><input type="radio" name="tipo-negocio" value="${esc(t.frase)}"><span>${esc(t.texto)}</span></label>`)
            .join('')}
        </fieldset>
        <p class="mensaje-previo"><span class="sr">Mensaje que se enviará: </span>“<span data-mensaje>${esc(s.mensajeWhatsApp.trimEnd())}…</span>”</p>
        <a class="boton boton-wa boton-grande boton-bloque" data-wa-contacto href="${enlaceWhatsApp(s.whatsapp, s.mensajeWhatsApp)}" target="_blank" rel="noopener" data-evento="whatsapp-contacto">${icono('chat')}<span>${esc(k.boton)}</span></a>
        <p class="correo">${esc(k.textoCorreo)} <a href="mailto:${esc(s.correo)}" data-evento="correo">${esc(s.correo)}</a></p>
      </div>
    </div>
  </section>`;
}

export function pie(c) {
  const s = c.sitio;
  return `
  <footer class="pie">
    <div class="contenedor pie-fila">
      <div class="marca"><span class="marca-logo" aria-hidden="true">${esc(s.iniciales)}</span><span>${esc(c.pie.texto)}</span></div>
      <nav class="pie-enlaces" aria-label="Contacto">
        <a href="${enlaceWhatsApp(s.whatsapp, s.mensajeWhatsApp)}" target="_blank" rel="noopener" data-evento="whatsapp-pie">${icono('chat')} WhatsApp ${esc(s.whatsappVisible)}</a>
        <a href="mailto:${esc(s.correo)}" data-evento="correo-pie">${icono('correo')} Correo</a>
        <a href="${esc(c.demo.urlBase)}" target="_blank" rel="noopener" data-evento="demo-pie">${icono('externo')} Demo</a>
      </nav>
      <p class="pie-legal">© ${new Date().getFullYear()} ${esc(s.nombre)} · ${esc(s.ciudad)}, ${esc(s.estado)}</p>
    </div>
  </footer>
  <a class="wa-flotante" href="${enlaceWhatsApp(s.whatsapp, s.mensajeWhatsApp)}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp" data-flotante data-evento="whatsapp-flotante">${icono('chat')}</a>`;
}
