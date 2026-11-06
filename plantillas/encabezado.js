// Barra superior con navegación por anclas y portada (hero).
import { esc, icono, enlaceWhatsApp, captura } from './util.js';

export function barra(c) {
  const s = c.sitio;
  const enlaces = c.navegacion.map((n) => `<a href="#${esc(n.ancla)}">${esc(n.texto)}</a>`).join('');
  return `
  <a class="saltar" href="#contenido">Saltar al contenido</a>
  <header class="barra">
    <div class="contenedor barra-fila">
      <a class="marca" href="#inicio" aria-label="${esc(s.nombre)}, ir al inicio">
        <span class="marca-logo" aria-hidden="true">${esc(s.iniciales)}</span>
        <span class="marca-nombre">${esc(s.nombre)}</span>
      </a>
      <nav class="nav-escritorio" aria-label="Secciones">${enlaces}</nav>
      <a class="boton boton-wa boton-chico" href="${enlaceWhatsApp(s.whatsapp, s.mensajeWhatsApp)}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp" data-evento="whatsapp-barra">${icono('chat')}<span>WhatsApp</span></a>
      <details class="nav-movil">
        <summary aria-label="Abrir menú">${icono('menu')}</summary>
        <nav aria-label="Secciones">${enlaces}</nav>
      </details>
    </div>
  </header>`;
}

export function portada(c) {
  const s = c.sitio;
  const e = c.encabezado;
  const rubro = c.demo.rubros.find((r) => r.slug === e.rubroCaptura) || c.demo.rubros[0];
  return `
  <section class="portada" id="inicio">
    <div class="contenedor portada-rejilla">
      <div class="portada-texto">
        <p class="antetitulo">${esc(e.antetitulo)}</p>
        <h1>${esc(e.titulo)}</h1>
        <p class="portada-sub">${esc(e.subtitulo)}</p>
        <div class="botones">
          <a class="boton boton-primario boton-grande" href="#demo" data-evento="demo-portada">${icono('play')}<span>${esc(e.botonDemo)}</span></a>
          <a class="boton boton-wa boton-grande" href="${enlaceWhatsApp(s.whatsapp, s.mensajeWhatsApp)}" target="_blank" rel="noopener" data-evento="whatsapp-portada">${icono('chat')}<span>${esc(e.botonWhatsApp)}</span></a>
        </div>
        <p class="nota">${esc(e.nota)}</p>
      </div>
      <div class="portada-visual" aria-hidden="false">
        <div class="telefono telefono-portada">
          <div class="telefono-pantalla">
            ${captura({ rubro: rubro.slug, pantalla: e.pantallaCaptura, alt: `Captura de la demo: agenda de un ${rubro.nombre.toLowerCase()} en el celular`, carga: 'eager', prioridad: 'high', tamanos: '(min-width: 900px) 260px, 62vw' })}
          </div>
        </div>
        <div class="burbuja burbuja-1" aria-hidden="true">${icono('ok')} Recordatorio enviado</div>
        <div class="burbuja burbuja-2" aria-hidden="true">${icono('grafica')} Ganancia del mes +18%</div>
      </div>
    </div>
  </section>`;
}
