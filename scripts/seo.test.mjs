import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { elements, attribute, htmlFiles } from './build-agent-content.mjs';

const files = await htmlFiles('dist');
const cards = JSON.parse(await readFile('src/data/og-cards.json', 'utf8'));
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const guide = await readFile('dist/llms.txt', 'utf8');
const full = await readFile('dist/llms-full.txt', 'utf8');
const meta = (nodes, key) => attribute(nodes.find(n => n.tagName === 'meta' && (attribute(n, 'name') === key || attribute(n, 'property') === key)), 'content');
const text = node => node?.value ?? (node?.childNodes ?? []).map(text).join('');

test('built pages have unique Portuguese metadata, canonical identities and complete social cards', async () => {
  const titles = new Set(), descriptions = new Set(), paths = [], images = new Set();
  for (const file of files) {
    const nodes = elements(parse(await readFile(file, 'utf8')));
    assert.equal(attribute(nodes.find(n => n.tagName === 'html'), 'lang'), 'pt-BR', file);
    const links = nodes.filter(n => n.tagName === 'link' && attribute(n, 'rel') === 'canonical');
    assert.equal(links.length, 1, file);
    const canonical = attribute(links[0], 'href');
    assert.match(canonical, /^https:\/\/dosedetelemetria\.com\/(?:[^?#]*\/)?$/);
    assert.equal(meta(nodes, 'og:url'), canonical);
    const title = text(nodes.find(n => n.tagName === 'title'));
    const description = meta(nodes, 'description');
    assert.ok(title.length <= 60, `${file}: ${title}`);
    assert.ok(description.length <= 125, `${file}: ${description}`);
    assert.ok(!titles.has(title), title); titles.add(title);
    assert.ok(!descriptions.has(description), description); descriptions.add(description);
    assert.equal(meta(nodes, 'og:description'), description);
    assert.equal(meta(nodes, 'twitter:description'), description);
    assert.equal(meta(nodes, 'og:locale'), 'pt_BR');
    const path = new URL(canonical).pathname; paths.push(path);
    const card = cards.find(c => c.path === path); assert.ok(card, path);
    assert.equal(meta(nodes, 'og:image'), `https://dosedetelemetria.com${card.image}`);
    assert.equal(meta(nodes, 'twitter:image'), meta(nodes, 'og:image'));
    assert.equal(meta(nodes, 'og:image:alt'), card.alt);
    assert.equal(meta(nodes, 'twitter:image:alt'), card.alt);
    assert.equal(meta(nodes, 'og:image:type'), 'image/png');
    const png = await readFile(`dist${card.image}`);
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
    const hash = createHash('sha256').update(png).digest('hex');
    assert.ok(!images.has(hash), `${path}: duplicate card`); images.add(hash);
    const headings = nodes.filter(n => /^h[1-6]$/.test(n.tagName ?? ''));
    assert.equal(headings.filter(n => n.tagName === 'h1').length, 1, file);
    let previous = 0;
    for (const heading of headings) {
      const level = Number(heading.tagName[1]);
      assert.ok(level <= previous + 1, `${file}: skipped h${previous} to h${level}`);
      previous = level;
    }
    assert.ok(nodes.some(n => n.tagName === 'main' && attribute(n, 'id') === 'main'));
    const schemas = nodes.filter(n => n.tagName === 'script' && attribute(n, 'type') === 'application/ld+json').map(n => JSON.parse(text(n)));
    const graph = schemas.find(s => s['@graph'])['@graph'];
    assert.ok(schemas.some(s => s['@id'] === 'https://dosedetelemetria.com/#organization') || graph.some(s => s['@id'] === 'https://dosedetelemetria.com/#organization'));
    assert.ok(graph.some(s => s['@type'] === 'WebPage' && s.url === canonical && s.inLanguage === 'pt-BR'));
  }
  assert.deepEqual(paths.sort(), cards.map(c => c.path).sort());
});

test('sitemap and agent exports exactly follow indexable HTML and preserve useful content', async () => {
  const expected = [];
  for (const file of files) {
    const nodes = elements(parse(await readFile(file, 'utf8')));
    const canonical = attribute(nodes.find(n => n.tagName === 'link' && attribute(n, 'rel') === 'canonical'), 'href');
    const alternate = nodes.find(n => n.tagName === 'link' && attribute(n, 'type') === 'text/markdown');
    assert.ok(alternate, file); await access(`dist${attribute(alternate, 'href')}`);
    const markdown = await readFile(file.replace(/\.html$/, '.md'), 'utf8');
    assert.match(markdown, /^Source: https:\/\/dosedetelemetria.com\//);
    assert.ok(markdown.length > 100, file); assert.doesNotMatch(markdown, /<script/);
    if (/noindex/.test(meta(nodes, 'robots'))) assert.ok(!full.includes(`Source: ${canonical}`));
    else { expected.push(canonical); assert.ok(full.includes(markdown), file); }
  }
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(urls.sort(), expected.sort()); assert.equal(new Set(urls).size, urls.length);
  assert.ok(!urls.some(u => u.includes('/404/')));
  for (const match of guide.matchAll(/\]\(https:\/\/dosedetelemetria.com(.*?)\)/g)) await access(`dist${match[1]}${match[1].endsWith('/') ? 'index.html' : ''}`);
  assert.match(await readFile('dist/products/index.md', 'utf8'), /\| Preço \| R\$ 5.997,00 \| R\$ 2.397,00 \|/);
});

test('course prices, currency and closed enrollment agree across HTML, schema and agent guide', async () => {
  for (const [slug, price, display] of [['trilha-otel','2397','R$ 2.397,00'],['especializacao-otel','5997','R$ 5.997,00']]) {
    const html = await readFile(`dist/products/${slug}/index.html`, 'utf8');
    const nodes = elements(parse(html));
    const course = nodes.filter(n => n.tagName === 'script' && attribute(n, 'type') === 'application/ld+json').map(n => JSON.parse(text(n))).find(s => s['@type'] === 'Course');
    assert.equal(course.offers.price, price); assert.equal(course.offers.priceCurrency, 'BRL');
    assert.equal(course.offers.availability, 'https://schema.org/OutOfStock');
    const markdown = await readFile(`dist/products/${slug}/index.md`, 'utf8');
    assert.ok(markdown.includes(display)); assert.ok(guide.includes(display)); assert.match(markdown, /Em breve/);
    assert.ok(nodes.some(n => n.tagName === 'button' && /Em breve/.test(text(n)) && attribute(n, 'disabled') !== undefined));
    assert.doesNotMatch(html, /href="https:\/\/mn\.dosedetelemetria\.com/);
    assert.match(html, /type="email"/);
    assert.ok(nodes.some(n => n.tagName === 'form' && attribute(n, 'method') === 'post'));
    assert.ok(nodes.some(n => n.tagName === 'button' && /Entrar na lista/.test(text(n)) && attribute(n, 'disabled') !== undefined));
    assert.doesNotMatch(html, /reviewRating|aggregateRating/);
  }
});
