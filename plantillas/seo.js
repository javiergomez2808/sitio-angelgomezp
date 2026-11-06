// Etiquetas del <head>: título, descripción, vista previa para WhatsApp y redes (Open Graph) y datos estructurados.
import { esc, srcsetCaptura } from './util.js';

export function head(c) {
  const s = c.sitio;
  const imagen = new URL(s.imagenCompartir, s.url).toString();
  const negocio = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${s.nombre} · Desarrollo web y automatización`,
    description: s.descripcion,
    url: s.url,
    image: imagen,
    logo: new URL('/apple-touch-icon.png', s.url).toString(),
    telephone: `+${s.whatsapp}`,
    email: s.correo,
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: s.ciudad, addressRegion: s.estado, addressCountry: s.pais },
    areaServed: [{ '@type': 'City', name: s.ciudad }, { '@type': 'State', name: s.estado }],
    founder: { '@type': 'Person', name: s.nombre },
    knowsLanguage: 'es-MX',
    makesOffer: c.planes.items.map((p) => ({
      '@type': 'Offer',
      name: `Plan ${p.nombre}`,
      description: p.para,
      price: p.precio,
      priceCurrency: c.planes.moneda,
    })),
  };
  const preguntas = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.preguntas.items.map((q) => ({ '@type': 'Question', name: q.pregunta, acceptedAnswer: { '@type': 'Answer', text: q.respuesta } })),
  };
  const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
  const hero = `/capturas/${c.encabezado.rubroCaptura}-${c.encabezado.pantallaCaptura}`;

  return `
    <title>${esc(s.titulo)}</title>
    <meta name="description" content="${esc(s.descripcion)}">
    <link rel="canonical" href="${esc(s.url)}/">
    <meta name="theme-color" content="${esc(s.colorTema)}" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#0F1513" media="(prefers-color-scheme: dark)">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_MX">
    <meta property="og:site_name" content="${esc(s.nombre)}">
    <meta property="og:title" content="${esc(s.titulo)}">
    <meta property="og:description" content="${esc(s.descripcion)}">
    <meta property="og:url" content="${esc(s.url)}/">
    <meta property="og:image" content="${esc(imagen)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(`${s.nombre}: ${c.encabezado.titulo}`)}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="preload" href="/fuentes/fraunces.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" as="image" href="${hero}-560.webp" imagesrcset="${srcsetCaptura(hero)}" imagesizes="(min-width: 900px) 260px, 62vw" fetchpriority="high">
    <script type="application/ld+json">${json(negocio)}</script>
    <script type="application/ld+json">${json(preguntas)}</script>`;
}
