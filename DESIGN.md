# Design System: TEC AUSTRAL — Sitio corporativo
**Fuente:** síntesis del código existente (`style.css`, `index.html`, páginas internas). DNA visual: `buildings-business.framer.website`.
**Stack:** HTML + CSS + JS vanilla, sin framework ni build step. Una hoja global (`style.css`) + una hoja por página.

## 1. Tema visual y atmósfera
Industrial técnico / sobrio ejecutivo europeo. Páginas predominantemente blancas con bandas negras de alto contraste (proyectos, footer, CTA final). Densidad baja: secciones de 5–6 rem de padding vertical, mucho aire. La decoración es casi nula — la jerarquía la dan el tamaño tipográfico extremo, los bordes hairline y un único acento naranja. Nada de sombras, nada de glassmorphism (salvo el blur del nav), nada de gradientes decorativos en UI (los gradientes existentes son *placeholders de fotos de obra*).

## 2. Paleta y roles
| Nombre | Valor | Rol |
|---|---|---|
| Negro tinta (`--black`) | `#0a0a0a` | Texto principal, bandas oscuras (proyectos, footer, CTA), hover de botones outline |
| Blanco (`--white`) | `#ffffff` | Fondo base, texto sobre bandas oscuras |
| Gris papel cálido (`--grey-soft`) | `#f5f4f2` | Fondos de sección alternos (servicios, contacto-CTA, cards aside) |
| Gris línea (`--grey-mid`) | `#e0deda` | Bordes hairline 1px, divisores, texto fantasma en headings grises |
| Gris texto (`--grey-text`) | `#888580` | Labels uppercase, metadatos, eyebrows |
| Gris oscuro (`--grey-dark`) | `#3a3835` | Cuerpo de texto secundario, links de nav |
| Naranja obra (`--orange`) | `#e8622a` | ÚNICO acento: botón primario, números de card, hover de links, `::selection`, flechas de lista |
| Naranja hover (`--orange-dark`) | `#c94f1a` | Hover del botón fill |

Regla: el naranja aparece en ≤ 3 % de la superficie. Nunca como fondo de sección.

## 3. Tipografía
- **Única familia:** Inter variable (Google Fonts, `ital,opsz,wght`), pesos 300–900. Sistema mono-fuente a propósito.
- **Display (h1 hero):** `clamp(3rem, 7vw, 7rem)`, weight 800, `line-height 1.0`, `letter-spacing -0.03em`.
- **Headings de sección:** `clamp(2rem, 4vw, 3.5rem)`, weight 700–800, tracking -0.02em.
- **Cuerpo:** 15–17px, `line-height 1.6–1.75`, color `--grey-dark`, medida máx ~44–66ch.
- **Labels / eyebrows / tags:** 10–13px, weight 500–600, `letter-spacing 0.08–0.12em`, UPPERCASE, color `--grey-text`.
- Heading bicolor permitido: parte en `--black`, parte en `--grey-mid` (header de Portfolio).

## 4. Componentes
- **Botones (`.btn`):** pill (`border-radius: 9999px`), 12px uppercase con tracking 0.08em. Variantes: `--fill` (naranja→naranja oscuro), `--outline` / `--outline-dark` (borde negro 1.5px, hover invierte), `--outline-light` (borde blanco, para bandas oscuras), `--lg`. `:active` escala 0.97; focus ring naranja `outline-offset 3px`.
- **Nav:** fija, blanco translúcido `rgba(255,255,255,0.94)` + `backdrop-filter: blur(12px)`, borde inferior hairline, 68px. Logo = dos rectángulos negros (alto/bajo) + wordmark bold. Hamburguesa ≤900px.
- **Cards de proyecto (banda negra):** track horizontal con scroll-snap, aspecto 3/4, radio 12px, overlay degradado negro inferior, número naranja + título blanco + meta + link subrayado.
- **Cards de contenido:** fondo blanco sobre `--grey-soft`, radio 8px, padding 2rem, h3 700 + cuerpo 14px.
- **Listas tipo "pillars":** filas uppercase 12px separadas por bordes hairline arriba/abajo, heading sticky a la izquierda (grid 1fr/1.5fr).
- **Specs / datos:** filas label-uppercase + valor, divididas por hairlines (patrón `pdet-meta__spec`).
- **Formularios:** inputs sin caja — solo `border-bottom` 1px `--grey-dark`, label uppercase 11px arriba, focus oscurece el borde. Sin radios ni fondos.
- **Tags:** pill hairline (`border: 1px solid --grey-mid`), 10px uppercase tracking 0.12em.
- **Footer:** banda negra, 4 columnas con labels uppercase, wordmark gigante `clamp(3rem, 10vw, 10rem)` weight 800 junto al logo, bottom bar hairline blanca al 10%.
- **Stats:** números `clamp(3rem, 8vw, 7rem)` weight 700 + label uppercase 11px, divisores verticales 1px.

## 5. Geometría, profundidad y layout
- **Radios:** pill para botones/tags; 8–12px para imágenes y cards; 0 en secciones. Sin sombras — la elevación se expresa con cambio de fondo y bordes.
- **Contenedor:** `max-width: 1400px`, `padding-inline: clamp(1rem, 3vw, 2rem)`.
- **Ritmo de secciones:** alternancia blanco → negro → blanco → gris-papel. Divisores: `border-top/bottom: 1px solid --grey-mid` en claro, `rgba(255,255,255,0.1)` en oscuro.
- **Layouts 50/50:** grid `1fr 1fr` imagen/texto con alternancia vía `--reverse` (truco `direction: rtl`). En móvil la imagen va arriba.

## 6. Movimiento
- Easing único: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease`). Duraciones 120–500ms.
- Scroll-reveal: `opacity + translateY(20px)`, stagger de 80ms entre hermanos (IntersectionObserver en `main.js`).
- Hover de imágenes: `scale(1.04)` 400ms. Solo se animan `transform` y `opacity`.
- `prefers-reduced-motion`: reveals visibles sin transición.

## 7. Contenido y tono
- Fuente única de verdad: `tec-austral-web-content.json`. **No inventar métricas, clientes ni testimonios.**
- Tono: directo, técnico, sin "calidad" ni "innovación" sueltas. Lector: ingeniero/arquitecto técnico.
- Imágenes: hasta recibir fotos reales, placeholders con gradientes OKLCH oscuros tierra/azulados (145°) que evocan obra metálica al atardecer.
- El estadio de Barcelona se referencia como "estadio de fútbol de referencia en Barcelona" (sin nombre, restricción contractual).
- Copys de botones: uppercase, verbo directo ("HABLEMOS DE TU PROYECTO", "VER CASOS REALES").

## 8. Mapa de páginas
`index.html` (Home) · `servicios.html` · `portfolio.html` (grid con filtros) · `casos.html` (5 casos reales: estel, fe, estadio, monaco, bunker) · `nosotros.html` (About) · `contacto.html`. Nav global: Servicios · Portfolio · Casos · Nosotros · Contacto + CTA WhatsApp (`https://wa.me/+34642033304`).
