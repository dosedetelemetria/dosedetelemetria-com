export function prefersMarkdown(accept = '') {
  const ranges = accept.toLowerCase().split(',').map((range) => {
    const [type, ...parameters] = range.trim().split(';');
    const quality = parameters.find((parameter) => parameter.trim().startsWith('q='));
    return { type: type.trim(), q: quality ? Number(quality.trim().slice(2)) : 1 };
  });
  const markdown = ranges.find((range) => range.type === 'text/markdown')?.q ?? 0;
  const html = ranges.find((range) => range.type === 'text/html')?.q
    ?? ranges.find((range) => range.type === 'text/*')?.q
    ?? ranges.find((range) => range.type === '*/*')?.q ?? 0;
  return markdown > 0 && markdown >= html;
}

export default async function handler(request, context, fetchMarkdown = fetch) {
  if (!['GET', 'HEAD'].includes(request.method)) return;
  const response = await context.next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const headers = new Headers(response.headers);
  const vary = headers.get('vary')?.split(',').map((value) => value.trim()) ?? [];
  if (!vary.some((value) => value.toLowerCase() === 'accept')) vary.push('Accept');
  headers.set('vary', vary.join(', '));
  if (!prefersMarkdown(request.headers.get('accept') ?? '') || ![200, 404].includes(response.status)) {
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }

  let body;
  if (response.status === 404) {
    body = '# Página não encontrada\n\nA página solicitada não existe. Encontre cursos de OpenTelemetry pelo [guia para agentes](/llms.txt), [sitemap](/sitemap.xml) ou [início](/).\n';
  } else {
    const url = new URL(request.url);
    url.pathname = url.pathname.endsWith('.html')
      ? url.pathname.replace(/\.html$/, '.md')
      : `${url.pathname.replace(/\/$/, '')}/index.md`;
    url.search = '';
    try {
      const source = await fetchMarkdown(url);
      if (source.ok) body = await source.text();
    } catch {
      // Keep the original page usable if the Markdown asset cannot be retrieved.
    }
    if (!body) return new Response(response.body, { status: response.status, headers });
  }
  headers.set('content-type', 'text/markdown; charset=utf-8');
  headers.set('cache-control', 'no-store');
  headers.set('x-robots-tag', 'noindex');
  for (const name of ['content-length', 'content-encoding', 'etag', 'last-modified']) headers.delete(name);
  return new Response(request.method === 'HEAD' ? null : body, { status: response.status, headers });
}

