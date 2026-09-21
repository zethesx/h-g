# Hausmeister- und Gartenservice Lauenburg

Responsive German landing page for a local property, garden and maintenance service in Lauenburg/Elbe.

## Install

```sh
npm install
```

## Development

```sh
npm run dev
```

## Production build

```sh
npm run build
```

## Preview

```sh
npm run preview
```

The production-ready static output is written to `dist/`.

## Base path

The default build targets the domain root (`/`). For a subpath deployment, set `VITE_BASE_PATH` before building:

```sh
VITE_BASE_PATH=/example/path/ npm run build
```

On PowerShell:

```powershell
$env:VITE_BASE_PATH='/example/path/'; npm run build
```

## Contact form

The online form remains disabled until a same-origin production endpoint and the responsible recipient are configured in `src/config.js`. The two telephone links remain available throughout the site.
