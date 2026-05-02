# closerclick — landing site

Landing page para el ecosistema **Closer Click**: lista de las apps que usan el proxy y descripción del servicio. Es un PWA instalable (sin caching de service worker — siempre red), Vue 3 + Vite + TypeScript.

🌐 Producción: **https://seyacat.github.io/closerclick/**

## Cómo funciona

- **Primera visita**: muestra el home completo (hero + servicio + API + apps).
- **Visitas siguientes**: muestra solo la sección "Aplicaciones" condensada (botones para abrir cada app + link al repo). Un botón "Ver home completo" expande el resto.
- **Instalable**: el manifest declara icons 192/512 y maskable. SW intencionalmente sin precache (`generateSW` con `globPatterns: []`) para evitar problemas de "no se ve la versión nueva".

## Apps listadas

- [Closer Click Chat](https://seyacat.github.io/simple-websocket-chat/)
- [QRShare](https://seyacat.github.io/qrshare/)
- [Closer Click Chess](https://seyacat.github.io/simple-websocket-chess/)

## Build

```bash
./build.sh         # genera ../api/src/public/ (instala deps si falta)
# o npm install && npm run build
```

`build.sh`:

1. `npm install` si falta `node_modules`.
2. `node scripts/gen-icons.mjs` (genera `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` con sharp desde `images/logo.png`).
3. `vue-tsc -b && vite build` que escribe en `../api/src/public/`.

## Deploy

GitHub Actions workflow no incluido (build manual y commit del output, o desde un servidor que sirva `api/src/public/`).

## Estructura

```
closerclick/
├── images/             logos + parallax stock
├── public/icons/       icons generados (no commiteados)
├── scripts/gen-icons.mjs   generador de icons
├── src/
│   ├── App.vue         landing (compact + full)
│   ├── main.ts
│   └── style.css
├── vite.config.ts      base ./, outDir ../api/src/public, vite-plugin-pwa sin cache
└── build.sh
```

## Licencia

MIT
