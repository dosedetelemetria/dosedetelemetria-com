import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';

test('Worker serves negotiated Markdown from its deployment assets', async () => {
  const response = await worker.fetch(
    new Request('https://preview.workers.dev/products/?campaign=test', { headers: { Accept: 'text/markdown' } }),
    { ASSETS: { fetch: async (input) => {
      if (input instanceof Request) return new Response('<h1>Courses</h1>', { headers: { 'Content-Type': 'text/html' } });
      assert.equal(input.href, 'https://preview.workers.dev/products/index.md');
      return new Response('# Courses');
    } } },
  );
  assert.equal(await response.text(), '# Courses');
  assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
});

test('Worker passes writes through once', async () => {
  let calls = 0;
  const response = await worker.fetch(
    new Request('https://preview.workers.dev/', { method: 'POST' }),
    { ASSETS: { fetch: async () => { calls++; return new Response('Method not allowed', { status: 405 }); } } },
  );
  assert.equal(calls, 1);
  assert.equal(response.status, 405);
});

test('Worker canonicalizes www and preserves path and query', async () => {
  const response = await worker.fetch(new Request('http://www.dosedetelemetria.com:8791/products/?campaign=test'));
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://dosedetelemetria.com/products/?campaign=test');
});

test('legacy blog routes preserve article, feed and topic destinations with permanent redirects', async () => {
  const cases = [
    ['/', '/blog/'], ['/archive/', '/blog/'], ['/recommendations', '/blog/'], ['/members', '/blog/'],
    ['/rss.xml', '/blog/rss.xml'], ['/sitemap.xml', '/sitemap.xml'], ['/robots.txt', '/robots.txt'],
    ['/o-dilema-da-telemetria', '/blog/o-dilema-da-telemetria/'],
    ['/o-dilema-da-telemetria/', '/blog/o-dilema-da-telemetria/'],
    ['/o-dilema-da-telemetria.md', '/blog/o-dilema-da-telemetria/index.md'],
    ['/tag/telemetria/', '/blog/tags/telemetria/'],
  ];
  for (const [from, to] of cases) {
    const response = await worker.fetch(new Request(`https://blog.dosedetelemetria.com${from}?source=legacy`));
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('location'), `https://dosedetelemetria.com${to}?source=legacy`);
  }
  for (const path of ['/missing', '/tag/missing', '//evil.example', '/%zz']) {
    const response = await worker.fetch(new Request(`https://blog.dosedetelemetria.com${path}`));
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  }
});
