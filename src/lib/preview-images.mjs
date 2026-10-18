import { site } from '../data/site.mjs';
const imagePrefix = `${site.url}/og/`;

export function previewImageUrl(value, origin) {
  return value?.startsWith(imagePrefix)
    ? `${origin}/og/${value.slice(imagePrefix.length)}`
    : value;
}

export default function previewImages(request, response) {
  const url = new URL(request.url);
  if (url.hostname === new URL(site.url).hostname || request.method !== 'GET'
      || !response.headers.get('content-type')?.includes('text/html')) return response;

  const headers = new Headers(response.headers);
  for (const name of ['content-length', 'etag', 'last-modified']) headers.delete(name);
  const imageHandler = {
    element(element) {
      const value = element.getAttribute('content');
      if (value) element.setAttribute('content', previewImageUrl(value, url.origin));
    },
  };
  let schema = '';
  return new HTMLRewriter()
    .on('meta[property="og:image"], meta[property="og:image:url"], meta[property="og:image:secure_url"], meta[name="twitter:image"]', imageHandler)
    .on('script[type="application/ld+json"]', {
      element() { schema = ''; },
      text(chunk) {
        schema += chunk.text;
        if (chunk.lastInTextNode) {
          chunk.replace(schema.replaceAll(imagePrefix, `${url.origin}/og/`), { html: true });
        } else {
          chunk.remove();
        }
      },
    })
    .transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}
