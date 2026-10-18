import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { prefersMarkdown } from '../src/lib/markdown-response.mjs';

test('negotiation respects explicit Markdown preferences and exclusions', () => {
  for (const accept of ['', '*/*', 'text/html', 'text/markdown;q=0', 'text/html, text/markdown;q=0.5']) assert.equal(prefersMarkdown(accept), false, accept);
  for (const accept of ['text/markdown', 'text/markdown, text/html;q=0.5', 'text/markdown; charset=utf-8', 'text/markdown;q=1, */*;q=0.5']) assert.equal(prefersMarkdown(accept), true, accept);
});

test('HTML and redirects retain their original responses', async () => {
  const response = await handler(new Request('https://dosedetelemetria.com/', { headers: { Accept: 'text/html' } }), { next: async () => new Response('<h1>Courses</h1>', { headers: { 'Content-Type': 'text/html', Vary: 'Accept-Encoding' } }) });
  assert.equal(response.headers.get('vary'), 'Accept-Encoding, Accept');
  assert.equal(await response.text(), '<h1>Courses</h1>');
  const redirect = new Response(null, { status: 301, headers: { Location: '/products/' } });
  assert.equal(await handler(new Request('https://dosedetelemetria.com/courses', { headers: { Accept: 'text/markdown' } }), { next: async () => redirect }), redirect);
});

test('Markdown responses use built content and remove HTML validators', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => { calls.push(url.href); return new Response('# OpenTelemetry courses\n\nCurrent prices and availability.'); });
  const response = await handler(new Request('https://dosedetelemetria.com/products/?campaign=test', { headers: { Accept: 'text/markdown' } }), { next: async () => new Response('<h1>Courses</h1>', { headers: { 'Content-Type': 'text/html', ETag: 'html-tag', 'Content-Length': '16', 'Content-Encoding': 'gzip' } }) });
  assert.deepEqual(calls, ['https://dosedetelemetria.com/products/index.md']);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/markdown/);
  assert.match(response.headers.get('vary'), /Accept/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  for (const header of ['etag', 'content-length', 'content-encoding']) assert.equal(response.headers.get(header), null);
  assert.match(await response.text(), /Current prices/);
});

test('unknown paths keep 404 status with a useful Markdown recovery body', async () => {
  for (const method of ['GET', 'HEAD']) {
    const response = await handler(new Request('https://dosedetelemetria.com/missing', { method, headers: { Accept: 'text/markdown' } }), { next: async () => new Response('<h1>Missing</h1>', { status: 404, headers: { 'Content-Type': 'text/html' } }) });
    assert.equal(response.status, 404);
    assert.match(response.headers.get('content-type'), /text\/markdown/);
    assert.match(response.headers.get('vary'), /Accept/);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex');
    const body = await response.text();
    method === 'GET' ? assert.match(body, /\[guia para agentes\]\(\/llms.txt\)/) : assert.equal(body, '');
  }
});

test('missing Markdown files fail back to readable HTML; assets and writes pass through', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('missing', { status: 404 }));
  const context = { next: async () => new Response('<h1>Courses</h1>', { headers: { 'Content-Type': 'text/html' } }) };
  const response = await handler(new Request('https://dosedetelemetria.com/', { headers: { Accept: 'text/markdown' } }), context);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /Courses/);
  const asset = new Response('image', { headers: { 'Content-Type': 'image/svg+xml' } });
  assert.equal(await handler(new Request('https://dosedetelemetria.com/logo.svg'), { next: async () => asset }), asset);
  assert.equal(await handler(new Request('https://dosedetelemetria.com/', { method: 'POST' }), { next: () => assert.fail('Must not handle writes') }), undefined);
});


test('transport failures preserve HTML and direct HTML paths resolve their Markdown counterpart', async (t) => {
  const context = { next: async () => new Response('<h1>Readable</h1>', { headers: { 'Content-Type': 'text/html' } }) };
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Temporary failure'); });
  const fallback = await handler(new Request('https://dosedetelemetria.com/', { headers: { Accept: 'text/markdown' } }), context);
  assert.match(await fallback.text(), /Readable/);
  t.mock.method(globalThis, 'fetch', async (url) => { assert.equal(url.pathname, '/products/index.md'); return new Response('# Courses'); });
  const response = await handler(new Request('https://dosedetelemetria.com/products/index.html', { headers: { Accept: 'text/markdown' } }), context);
  assert.equal(await response.text(), '# Courses');
});
