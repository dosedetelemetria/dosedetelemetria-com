import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { buildAgentContent, elements, attribute, htmlFiles } from './build-agent-content.mjs';

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

test('all six migrated posts retain their bodies, original dates, assets, headings and discovery links', async () => {
  const posts = JSON.parse(await readFile('src/data/blog-migration.json', 'utf8'));
  assert.equal(posts.length, 6);
  const index = await readFile('dist/blog/index.html', 'utf8');
  const rss = await readFile('dist/blog/rss.xml', 'utf8');
  const items = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => match[1]);
  for (const post of posts) {
    const source = await readFile(`src/content/blog/${post.slug}.md`, 'utf8');
    const body = source.split('---\n\n').slice(1).join('---\n\n');
    assert.equal(createHash('sha256').update(body).digest('hex'), post.bodySha256, post.slug);
    const path = `/blog/${post.slug}/`;
    const html = await readFile(`dist${path}index.html`, 'utf8');
    const nodes = elements(parse(html));
    const article = nodes.filter(n => n.tagName === 'script' && attribute(n, 'type') === 'application/ld+json').map(n => JSON.parse(text(n))).find(s => ['TechArticle', 'BlogPosting'].includes(s['@type']));
    assert.equal(article.datePublished, post.publishedAt);
    assert.equal(article.dateModified, post.updatedAt);
    assert.equal(meta(nodes, 'og:type'), 'article');
    assert.equal(meta(nodes, 'article:published_time'), post.publishedAt);
    assert.equal(meta(nodes, 'article:modified_time'), post.updatedAt);
    assert.equal(article.image, meta(nodes, 'og:image'));
    assert.ok(index.includes(`href="${path}"`));
    assert.ok(guide.includes(`https://dosedetelemetria.com${path}`));
    assert.equal(items.filter(item => item.includes(`<link>https://dosedetelemetria.com${path}</link>`)).length, 1);
    assert.ok(rss.includes(new Date(post.publishedAt).toUTCString()));
    for (const id of post.headingIds) assert.ok(nodes.some(n => attribute(n, 'id') === id), `${post.slug}: missing legacy fragment ${id}`);
    const ids = nodes.map(n => attribute(n, 'id')).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length, `${post.slug}: duplicate IDs`);
    for (const image of nodes.filter(n => n.tagName === 'img')) {
      assert.ok(attribute(image, 'alt'), post.slug);
      assert.ok(attribute(image, 'width') && attribute(image, 'height'), post.slug);
      const src = attribute(image, 'src');
      assert.ok(src.startsWith('/'), `${post.slug}: external image ${src}`);
      await access(`dist${src}`);
    }
    assert.doesNotMatch(html, /cdn\.hashnode\.com|%\[https:\/\/www\.youtube/);
    const md = await readFile(`dist${path}index.md`, 'utf8');
    if (post.slug.startsWith('seu-maior')) { assert.match(md, /```/); assert.match(md, /otelcol_exporter_sent_metric_points/); }
    for (const tag of post.tags) assert.ok((await readFile(`dist/blog/tags/${tag}/index.html`, 'utf8')).includes(`href="${path}"`));
  }
});

test('agent export fences cannot be closed by code content and only TOC navigation is omitted', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dose-agent-export-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const code = 'template: |\n  ```yaml\n  key: "<&>"\n  ```\n';
  const escaped = code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  await writeFile(join(directory, 'index.html'), `<html><head><link rel="canonical" href="https://dosedetelemetria.com/"><meta name="description" content="Fixture"></head><body><main>
    <h1>Readable content</h1>
    <details><summary>Sumário</summary><nav aria-label="Sumário"><a href="#code">Code</a></nav></details>
    <aside><nav aria-label="Sumário">Duplicate TOC</nav></aside>
    <details><summary>Why this works</summary><p>Important explanation stays.</p></details>
    <nav aria-label="Related articles"><a href="/blog/">Read more</a></nav>
    <pre data-language="yaml"><code>${escaped}</code></pre>
    <pre><code>unlabelled code</code></pre>
    <figure><img src="/diagram.webp" alt="Application sends telemetry to a Collector."><figcaption>The queue buffers pending exports.</figcaption></figure>
  </main></body></html>`);
  await writeFile(join(directory, 'llms.txt'), '# Guide\n');
  await buildAgentContent(directory);
  const content = await readFile(join(directory, 'index.md'), 'utf8');
  assert.ok(content.includes(`\`\`\`\`yaml\n${code}\`\`\`\``));
  assert.match(content, /```\nunlabelled code\n```/);
  assert.match(content, /Important explanation stays/);
  assert.match(content, /Read more\]\(https:\/\/dosedetelemetria.com\/blog\/\)/);
  assert.match(content, /!\[Application sends telemetry to a Collector\.\]\(https:\/\/dosedetelemetria.com\/diagram.webp\)/);
  assert.match(content, /The queue buffers pending exports/);
  assert.doesNotMatch(content, /Sumário|Duplicate TOC/);
});


test('highlighted article code retains its language and whitespace in Markdown and full exports', async () => {
  let blocks = 0;
  for (const file of files.filter(file => file.includes('/blog/'))) {
    const nodes = elements(parse(await readFile(file, 'utf8')));
    const content = await readFile(file.replace(/\.html$/, '.md'), 'utf8');
    for (const pre of nodes.filter(node => node.tagName === 'pre')) {
      const code = pre.childNodes.find(node => node.tagName === 'code');
      if (!code) continue;
      const value = text(code).replace(/\n$/, '');
      assert.ok(content.includes(`\n${value}\n`), file);
      assert.ok(content.includes(`\`\`\`${attribute(pre, 'data-language') ?? ''}\n`), file);
      assert.ok(full.includes(`\n${value}\n`), file);
      blocks++;
    }
    assert.doesNotMatch(content, /Nesta página|Sumário/, file);
  }
  assert.ok(blocks > 0);
});
