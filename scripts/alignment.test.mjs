import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';
import { elements, attribute } from './build-agent-content.mjs';
import { site } from '../src/data/site.mjs';
import { previewImageUrl } from '../src/lib/preview-images.mjs';
const text = node => node?.value ?? (node?.childNodes ?? []).map(text).join('');
const nodesAt = async path => elements(parse(await readFile(`dist/${path}`, 'utf8')));

test('catalog links, availability and comparison headings remain accessible', async () => {
  const nodes = await nodesAt('products/index.html');
  assert.equal(attribute(nodes.find(n => n.tagName === 'html'), 'lang'), site.language);
  for (const path of site.navigation.map(link => link.path)) assert.ok(nodes.some(n => n.tagName === 'a' && attribute(n, 'href') === path), path);
  const table = nodes.find(n => n.tagName === 'table');
  assert.ok(table);
  const headers = elements(table).filter(n => n.tagName === 'th');
  assert.equal(headers.filter(n => attribute(n, 'scope') === 'col').length, 3);
  assert.ok(headers.every(n => text(n).trim()));
  assert.ok(headers.some(n => attribute(n, 'scope') === 'row'));
  const courseLinks = nodes.filter(n => n.tagName === 'a' && attribute(n, 'class')?.includes('site-button') && attribute(n, 'href')?.startsWith('/products/'));
  assert.equal(courseLinks.length, 2);
  assert.equal(courseLinks.filter(n => attribute(n, 'class').includes('site-button-primary')).length, 1);
  for (const link of courseLinks) {
    const course = await nodesAt(`${attribute(link, 'href').slice(1)}index.html`);
    const form = course.find(n => n.tagName === 'form');
    assert.equal(attribute(form, 'method'), 'post');
    const controls = elements(form);
    assert.ok(controls.some(n => n.tagName === 'button' && attribute(n, 'disabled') !== undefined));
    for (const input of controls.filter(n => ['input', 'textarea'].includes(n.tagName))) {
      assert.ok(controls.some(n => n.tagName === 'label' && attribute(n, 'for') === attribute(input, 'id')));
    }
    assert.ok(course.some(n => n.tagName === 'a' && attribute(n, 'href') === '#waitlist'));
    const ids = course.map(n => attribute(n, 'id')).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test('visible FAQ answers agree with schema on home, catalog and course pages', async () => {
  const index = await nodesAt('products/index.html');
  const links = index.filter(n => n.tagName === 'a' && attribute(n, 'class')?.includes('site-button') && attribute(n, 'href')?.startsWith('/products/'));
  for (const path of ['index.html', 'products/index.html', ...links.map(n => `${attribute(n, 'href').slice(1)}index.html`)]) {
    const nodes = await nodesAt(path);
    const faq = nodes.find(n => attribute(n, 'id') === 'faq');
    assert.ok(faq, path);
    const schema = nodes.filter(n => n.tagName === 'script' && attribute(n, 'type') === 'application/ld+json').map(n => JSON.parse(text(n))).find(s => s['@type'] === 'FAQPage');
    assert.equal(new URL(schema.url).origin, site.url);
    assert.equal(elements(faq).filter(n => n.tagName === 'details').length, schema.mainEntity.length);
    for (const question of schema.mainEntity) {
      const plain = text(faq).replace(/\s+/g, ' ');
      assert.ok(plain.includes(question.name));
      assert.ok(plain.includes(question.acceptedAnswer.text));
    }
  }
});

test('social preview assets use the deployment origin and preserve external images', () => {
  const origin = 'https://branch.example.workers.dev';
  assert.equal(previewImageUrl(`${site.url}/og/new.png`, origin), `${origin}/og/new.png`);
  assert.equal(previewImageUrl('https://images.example.org/new.png', origin), 'https://images.example.org/new.png');
  assert.equal(previewImageUrl(`${site.url}/products/`, origin), `${site.url}/products/`);
});


test('common UI sources use semantic brand tokens', async () => {
  const paths = JSON.parse(await readFile('scripts/site-alignment.json', 'utf8'));
  for (const path of paths.filter(path => /\.(astro|tsx|css)$/.test(path))) {
    assert.doesNotMatch(await readFile(path, 'utf8'), /telemetria-(orange|yellow)/, path);
  }
});


test('home uses direct course links and eagerly loads its lead video image', async () => {
  const home = await nodesAt('index.html');
  const hero = home.find(node => attribute(node, 'class')?.includes('video-embed'));
  const image = elements(hero).find(node => node.tagName === 'img');
  assert.equal(attribute(image, 'loading'), 'eager');
  assert.equal(attribute(image, 'fetchpriority'), 'high');
  const catalog = await nodesAt('products/index.html');
  const coursePaths = catalog.filter(node => node.tagName === 'a' && attribute(node, 'class')?.includes('site-button') && attribute(node, 'href')?.startsWith('/products/')).map(node => attribute(node, 'href'));
  const homeSection = home.find(node => attribute(node, 'id') === 'products');
  assert.ok(homeSection);
  const homeProducts = elements(homeSection);
  const detailLinks = homeProducts.filter(node => node.tagName === 'a' && attribute(node, 'class')?.includes('site-button'));
  assert.equal(detailLinks.length, coursePaths.length);
  for (const path of coursePaths) assert.ok(detailLinks.some(node => attribute(node, 'href') === path));
});
