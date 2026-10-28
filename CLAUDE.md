# CLAUDE.md

Tienda online de YOKA Market. Vue 3 + Vite + TypeScript, SCSS propio, Pinia, vue-router. Desplegada en Vercel. El backend es el repo hermano `yokamarket-backapp`.

## Comandos

```sh
pnpm dev        # :5173 — necesita el backapp en :8100
pnpm build      # vue-tsc -b && vite build (el type-check corre acá)
pnpm typecheck
```

Sin tests: la verificación es `pnpm build` + revisión en navegador.

## Reglas duras

- Ningún `.vue` pasa de 300 líneas: la lógica sale a un composable.
- Layout con flexbox; "grillas" con el mixin `flex-cards($basis, $gap)`.
- Sin librerías UI ni Tailwind. Tokens en `src/styles/index.scss`.
- Iconos Font Awesome por CDN (`<i class="fa-solid fa-…">`). Sin emojis en la UI.
- El copy vive en `src/config/site.ts`.
- Todo `VITE_*` se expone en el navegador: nunca un secreto ahí.

## Estilos: la trampa de `additionalData`

`vite.config.ts` antepone `@/styles/index.scss` a cada `<style lang="scss">`. Ese archivo solo puede tener variables y mixins. Todo lo que emite CSS va en `global.scss` (importado una vez en `main.ts`).

## Rutas

`/` tienda · `/producto/:slug` · `/checkout` · `/pay-response` (vuelve Payphone con `?id=&clientTransactionId=`) · `/pedido/:code` · `/admin/*` (login, pedidos, productos, tienda).

## Estado

- `stores/catalog.ts` — catálogo y ajustes de la tienda, una carga por visita.
- `stores/cart.ts` — líneas `{ productId, qty }` persistidas en localStorage; precios siempre del catálogo. Se vacía solo cuando el pago se confirma.
- `stores/user.ts` — sesión admin (token en localStorage, `restore()` contra `/auth/me`).
- `composables/useCheckout.ts` y `usePayResponse.ts` — lógica de pago.

`services/httpBase.ts` resuelve la URL del API (localhost → :8100; prod → `VITE_API_BASE_URL` o `yokamarket-backapp.vercel.app`).
