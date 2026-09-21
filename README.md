# Hausmeister- und Gartenservice Lauenburg

Responsive German landing page for a local property, garden and maintenance service in Lauenburg/Elbe.

## Local development

```sh
npm ci
npm run dev
```

The local development server uses the site root. The production build uses the public preview base path `/preview/h-g/`.

## Production build

```sh
npm run build
npm run preview
```

The deployable output is written to `dist/`.

## Deployment

The static build is deployed to the Cloudflare Pages project `zade-preview-h-g`. A path-scoped Worker named `zade-preview-h-g-router` proxies only `www.zade-studios.com/preview/h-g*` to that origin.

```sh
npm run deploy:origin
npm run deploy:router
```

The preview is intentionally unlisted. HTML metadata and response headers prevent search indexing.

## Contact form

The online form remains disabled until a same-origin production endpoint and the responsible recipient are configured in `src/config.js`. The two telephone links remain available throughout the site.
