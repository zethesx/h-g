const PREVIEW_PREFIX = '/preview/h-g';
const PREVIEW_ORIGIN = 'https://zade-preview-h-g.pages.dev';

function cachePolicy(pathname, contentType) {
  if (contentType.includes('text/html')) return 'no-cache';
  if (pathname.startsWith('/assets/')) return 'public, max-age=31536000, immutable';
  if (/\.(?:avif|gif|jpe?g|png|svg|webp|woff2?|mp4|webm)$/i.test(pathname)) {
    return 'public, max-age=86400';
  }
  return 'public, max-age=300';
}

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const belongsToPreview = incoming.pathname === PREVIEW_PREFIX || incoming.pathname.startsWith(`${PREVIEW_PREFIX}/`);

    if (incoming.hostname !== 'www.zade-studios.com' || !belongsToPreview) {
      return new Response('Nicht gefunden', { status: 404 });
    }

    const upstreamPath = incoming.pathname.slice(PREVIEW_PREFIX.length) || '/';
    const upstreamUrl = new URL(`${upstreamPath}${incoming.search}`, PREVIEW_ORIGIN);
    const upstreamResponse = await fetch(new Request(upstreamUrl, request));
    const headers = new Headers(upstreamResponse.headers);
    const contentType = headers.get('content-type') || '';

    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Cache-Control', cachePolicy(upstreamPath, contentType));

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  },
};
