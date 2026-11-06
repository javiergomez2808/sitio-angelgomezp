import './estilos/sitio.css';

const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const escritorio = matchMedia('(min-width: 900px)');

// ---------- Vitrina de la demo ----------
const datosDemo = document.getElementById('datos-demo');
if (datosDemo) iniciarVitrina(JSON.parse(datosDemo.textContent));

function urlDemo(d, rubro, pantalla) {
  const u = new URL(d.urlBase);
  u.searchParams.set('rubro', rubro);
  u.searchParams.set('plan', d.plan);
  const p = d.pantallas.find((x) => x.id === pantalla);
  return u.toString() + (p ? p.ruta : '');
}

function iniciarVitrina(d) {
  const raiz = document.querySelector('[data-vitrina]');
  const carrusel = raiz.querySelector('[data-carrusel]');
  const items = [...carrusel.querySelectorAll('[data-item]')];
  const puntos = [...raiz.querySelectorAll('[data-punto]')];
  const frase = raiz.querySelector('[data-frase]');
  const incluye = raiz.querySelector('[data-incluye]');
  const abrir = raiz.querySelector('[data-abrir]');
  const probar = raiz.querySelector('[data-probar]');
  const cerrar = raiz.querySelector('[data-cerrar-demo]');
  const pantallaTel = raiz.querySelector('[data-pantalla-telefono]');
  const icoOk = incluye.querySelector('svg')?.outerHTML || '';
  const estado = { rubro: d.rubros[0].slug, pantalla: d.pantallas[0].id, iframe: null };
  let desplazandoPorCodigo = false;

  const marcar = (atributo, valor) =>
    raiz.querySelectorAll(`[data-${atributo}]`).forEach((b) => b.setAttribute('aria-checked', String(b.dataset[atributo] === valor)));
  const rubroActual = () => d.rubros.find((x) => x.slug === estado.rubro);

  function actualizar() {
    const p = d.pantallas.find((x) => x.id === estado.pantalla);
    const r = rubroActual();
    frase.textContent = p.frase;
    incluye.replaceChildren(
      ...r.incluye.map((x) => {
        const li = document.createElement('li');
        li.innerHTML = icoOk;
        const span = document.createElement('span');
        span.textContent = x;
        li.append(span);
        return li;
      }),
    );
    abrir.href = urlDemo(d, estado.rubro, estado.pantalla);
    puntos.forEach((b) => (b.dataset.punto === estado.pantalla ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    if (estado.iframe) {
      estado.iframe.src = urlDemo(d, estado.rubro, estado.pantalla);
      estado.iframe.title = `Demo interactiva: ${r.nombre}`;
    }
  }

  function cambiarRubro(slug) {
    estado.rubro = slug;
    marcar('rubro', slug);
    const r = rubroActual();
    for (const fig of items) {
      const p = d.pantallas.find((x) => x.id === fig.dataset.item);
      const img = fig.querySelector('img');
      const base = `/capturas/${slug}-${p.id}`;
      img.srcset = [375, 560, 750].map((a) => `${base}-${a}.webp ${a}w`).join(', ');
      img.src = `${base}-560.webp`;
      img.alt = `Captura de la demo de ${r.nombre.toLowerCase()}: ${p.nombre.toLowerCase()}`;
    }
    actualizar();
  }

  function irAPantalla(id) {
    estado.pantalla = id;
    marcar('pantalla', id);
    const i = items.findIndex((f) => f.dataset.item === id);
    desplazandoPorCodigo = true;
    carrusel.scrollTo({ left: i * carrusel.clientWidth, behavior: sinMovimiento ? 'auto' : 'smooth' });
    setTimeout(() => (desplazandoPorCodigo = false), 600);
    actualizar();
  }

  // Al deslizar con el dedo, se sincroniza la pantalla elegida
  let espera;
  carrusel.addEventListener('scroll', () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      if (desplazandoPorCodigo) return;
      const i = Math.round(carrusel.scrollLeft / carrusel.clientWidth);
      const id = items[i]?.dataset.item;
      if (id && id !== estado.pantalla) {
        estado.pantalla = id;
        marcar('pantalla', id);
        actualizar();
      }
    }, 120);
  });

  raiz.addEventListener('click', (e) => {
    const r = e.target.closest('[data-rubro]');
    if (r) return cambiarRubro(r.dataset.rubro);
    const p = e.target.closest('[data-pantalla]');
    if (p) return irAPantalla(p.dataset.pantalla);
    const punto = e.target.closest('[data-punto]');
    if (punto) return irAPantalla(punto.dataset.punto);
  });

  // Teclado: flechas para moverse dentro de cada grupo de opciones
  raiz.querySelectorAll('[role="radiogroup"]').forEach((grupo) => {
    grupo.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      const botones = [...grupo.querySelectorAll('[role="radio"]')];
      const i = botones.indexOf(document.activeElement);
      const sig = botones[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + botones.length) % botones.length];
      sig.focus();
      sig.click();
      e.preventDefault();
    });
  });

  // "Probar aquí": carga la demo real solo cuando la piden (no afecta la velocidad de la página)
  function escalar() {
    if (!estado.iframe) return;
    estado.iframe.style.setProperty('--escala', String(pantallaTel.clientWidth / 375));
  }
  new ResizeObserver(escalar).observe(pantallaTel);

  probar?.addEventListener('click', () => {
    if (!estado.iframe) {
      const f = document.createElement('iframe');
      f.className = 'demo-iframe';
      f.title = `Demo interactiva: ${rubroActual().nombre}`;
      f.src = urlDemo(d, estado.rubro, estado.pantalla);
      f.setAttribute('allow', 'clipboard-write');
      pantallaTel.appendChild(f);
      estado.iframe = f;
      escalar();
    }
    raiz.classList.add('con-demo');
    cerrar.classList.remove('oculto');
    probar.classList.add('oculto');
    estado.iframe.focus({ preventScroll: true });
  });

  cerrar.addEventListener('click', () => {
    estado.iframe?.remove();
    estado.iframe = null;
    raiz.classList.remove('con-demo');
    cerrar.classList.add('oculto');
    probar?.classList.remove('oculto');
    probar?.focus();
  });
}

// ---------- Contacto: el mensaje de WhatsApp se completa con el tipo de negocio ----------
const contacto = document.querySelector('[data-contacto]');
if (contacto) {
  const boton = contacto.querySelector('[data-wa-contacto]');
  const vista = contacto.querySelector('[data-mensaje]');
  contacto.addEventListener('change', (e) => {
    if (!e.target.matches('input[name="tipo-negocio"]')) return;
    const frase = e.target.value;
    const mensaje = frase ? contacto.dataset.conTipo + frase : contacto.dataset.base;
    vista.textContent = frase ? mensaje : `${mensaje.trimEnd()}…`;
    boton.href = `https://wa.me/${contacto.dataset.numero}?text=${encodeURIComponent(mensaje)}`;
  });
}

// ---------- Botón flotante: se oculta si hay otro botón en la franja inferior de la pantalla ----------
// Así nunca tapa botones ni enlaces (y desaparece cuando el botón principal de WhatsApp está a la vista).
const flotante = document.querySelector('[data-flotante]');
function iniciarFlotante() {
  if (!flotante || !('IntersectionObserver' in window)) return;
  const enFranja = new Set();
  const principales = new Set();
  let observador;
  const actualizarFlotante = () => flotante.classList.toggle('escondido', enFranja.size > 0 || principales.size > 0);
  const vigilarFranja = () => {
    observador?.disconnect();
    enFranja.clear();
    const franja = 120; // alto (px) de la zona donde vive el botón flotante
    observador = new IntersectionObserver(
      (entradas) => {
        for (const en of entradas) en.isIntersecting ? enFranja.add(en.target) : enFranja.delete(en.target);
        actualizarFlotante();
      },
      { rootMargin: `-${Math.max(0, innerHeight - franja)}px 0px 0px 0px` },
    );
    document
      .querySelectorAll('main a.boton, main button.boton, main .enlace, .selector, .puntos, .tipos, .pie-enlaces, .comparativa summary, .pregunta summary')
      .forEach((el) => observador.observe(el));
  };
  vigilarFranja();
  addEventListener('resize', () => {
    clearTimeout(vigilarFranja.t);
    vigilarFranja.t = setTimeout(vigilarFranja, 200);
  });
  new IntersectionObserver((entradas) => {
    for (const en of entradas) en.isIntersecting ? principales.add(en.target) : principales.delete(en.target);
    actualizarFlotante();
  }).observe(document.querySelector('.portada .botones'));
}
const cuandoEsteLibre = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));
if (document.readyState === 'complete') cuandoEsteLibre(iniciarFlotante);
else addEventListener('load', () => cuandoEsteLibre(iniciarFlotante), { once: true });

// ---------- Tabla comparativa: abierta en computadora, plegable en celular ----------
const comparativa = document.querySelector('[data-abierto-escritorio]');
if (comparativa && escritorio.matches) comparativa.open = true;

// ---------- Menú del celular: se cierra al elegir una sección ----------
document.querySelector('.nav-movil')?.addEventListener('click', (e) => {
  if (e.target.closest('a')) e.currentTarget.removeAttribute('open');
});

// ---------- Eventos listos para analítica sin cookies ----------
// Cada clic en un elemento con data-evento queda en window.eventosSitio y, si instalas
// Plausible o Cloudflare Web Analytics con eventos, se envía también.
window.eventosSitio = window.eventosSitio || [];
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-evento]');
  if (!el) return;
  const nombre = el.dataset.evento;
  window.eventosSitio.push({ evento: nombre, fecha: new Date().toISOString() });
  if (typeof window.plausible === 'function') window.plausible(nombre);
  document.dispatchEvent(new CustomEvent('sitio:evento', { detail: { evento: nombre } }));
});
