# Sitio de Ángel Gómez · angelgomezp.dev

Sitio de una sola página para presentar mis servicios (páginas web, tableros de finanzas y automatizaciones)
a dueños de negocios, con la **demo real dentro de la página** y contacto directo por WhatsApp.

- Sitio: https://angelgomezp.dev
- Demo: https://demo.angelgomezp.dev (repositorio `javiergomez2808/demo-gestion`)

---

## 1. Cambiar textos, precios y datos

**Todo el contenido está en [`content.json`](content.json).** No hace falta tocar el código.

| Quiero cambiar… | Busca en content.json |
|---|---|
| WhatsApp, correo, ciudad, título y descripción para Google | `sitio` |
| Mensaje que llega por WhatsApp | `sitio.mensajeWhatsApp` y `contacto.tiposNegocio` |
| Portada | `encabezado` |
| Problemas que resuelvo | `problemas.items` |
| Precios y lo que incluye cada plan | `planes.items` (y `planes.comparativa` para la tabla) |
| Caso real | `caso` (ver abajo) |
| Pasos de trabajo, "Sobre mí" y preguntas | `proceso`, `sobreMi`, `preguntas` |

Después de guardar, sube los cambios a GitHub y el sitio se actualiza solo en 1–2 minutos.

### Caso real
- `esEjemplo: true` muestra la etiqueta "Caso de ejemplo" y la nota "Cifras ilustrativas". Cuando tengas datos reales,
  reemplaza los textos y números y cámbialo a `false`: se mostrará "Caso real" y la cita del cliente.
- `mostrarNombre: false` muestra `nombreAnonimo` ("Spa en Morelia"). Cuando tengas permiso, pon el nombre en
  `nombreReal` y cambia `mostrarNombre` a `true`.

### Tu foto
Guarda tu foto cuadrada (mínimo 440 × 440 px, idealmente WebP) en `public/fotos/angel.webp` y escribe en
`sobreMi.foto` el valor `"/fotos/angel.webp"`. Mientras esté vacío se muestran tus iniciales.

### Agregar un tipo de negocio a la vitrina
1. Crea el rubro en la demo (un archivo nuevo en `src/rubros/` del repositorio de la demo y publícala).
2. Agrega un elemento en `demo.rubros` de content.json con `slug` (el mismo id del rubro en la demo), `nombre`,
   `icono` (`hoja`, `tijeras`, `corazon`, `calendario`…), `descripcion` e `incluye` (3 viñetas).
3. Toma las capturas: `npm run capturas` (ver abajo).

---

## 2. Probarlo en tu computadora

Necesitas [Node.js](https://nodejs.org) 20.19 o más reciente.

```bash
npm install
npm run dev
```

Para ver la versión final, como quedará publicada: `npm run build` y luego `npm run preview`.

### Capturas de la demo e imágenes
Las capturas del celular son pantallas reales de la demo. Se vuelven a tomar con Microsoft Edge o Google Chrome
(no hay que instalar nada más):

```bash
npm run capturas
npm run imagenes
```

- `capturas` toma cada rubro × pantalla de content.json a 375 × 812 y las guarda en `public/capturas/`.
  Puedes usar otra dirección: `npm run capturas -- http://localhost:5173/`.
- `imagenes` genera la imagen para compartir (`public/og.png`, 1200 × 630) y los íconos con tus iniciales.

Si cambias de computadora y no tienes Edge en la ruta normal, indica tu navegador con la variable `NAVEGADOR`.

---

## 3. Estructura

```
content.json          ← todo el contenido editable
index.html, 404.html  esqueletos; el contenido se escribe dentro al construir el sitio
vite.config.js        arma el HTML final desde content.json (rápido y bueno para Google)
plantillas/           una función por sección (encabezado, problemas, vitrina, planes, caso, proceso…)
src/main.js           vitrina interactiva, carrusel, contacto, botón flotante y eventos de clic
src/estilos/          estilos (modo claro y oscuro automáticos)
public/               capturas, fuentes, imagen para compartir e íconos
scripts/              capturas de la demo e imágenes
```

### Medir clics (opcional)
Los botones importantes llevan `data-evento` (por ejemplo `whatsapp-portada`, `demo-probar`, `whatsapp-plan-control`).
Si agregas [Plausible](https://plausible.io) o Cloudflare Web Analytics (ambos sin cookies), los clics se envían solos
como eventos. Mientras tanto quedan en `window.eventosSitio`.

---

## 4. Publicación (GitHub Pages + Cloudflare)

### Sitio en angelgomezp.dev
1. Repositorio `javiergomez2808/sitio-angelgomezp` con **Settings → Pages → Source: GitHub Actions**.
2. En **Settings → Pages → Custom domain**: `angelgomezp.dev`.
3. El flujo `.github/workflows/deploy.yml` construye y publica en cada `push` a `main`.

### Demo en demo.angelgomezp.dev
Repositorio `javiergomez2808/demo-gestion`, con custom domain `demo.angelgomezp.dev`.

### Registros DNS en Cloudflare

| Tipo | Nombre | Contenido |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (un registro por IP) |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `javiergomez2808.github.io` |
| CNAME | `demo` | `javiergomez2808.github.io` |

Con la nube **naranja** (proxy de Cloudflare) el certificado HTTPS lo pone Cloudflare; deja apagado
"Enforce HTTPS" en GitHub y usa en Cloudflare **SSL/TLS: Full**. Con la nube **gris** (DNS only), GitHub emite su
propio certificado y puedes activar "Enforce HTTPS". Ambas formas funcionan.

### Atajos opcionales: spa., barberia. y consultorio.angelgomezp.dev
En Cloudflare → **Rules → Redirect Rules**, crea una regla por atajo (por ejemplo, si el host es
`spa.angelgomezp.dev`, redirige a `https://demo.angelgomezp.dev/?rubro=spa&plan=crecimiento#/web`) y agrega un
registro CNAME `spa` con proxy (nube naranja) apuntando a `angelgomezp.dev`.

### Otra opción: Netlify
Importa el repositorio en Netlify con comando `npm run build` y carpeta `dist`, y agrega el dominio en
*Domain management*.
