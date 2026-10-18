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
