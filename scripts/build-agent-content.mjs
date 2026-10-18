import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parse, serialize } from 'parse5';
import TurndownService from 'turndown';

export function elements(node) {
  return [node, ...(node.childNodes ?? []).flatMap(elements)];
}

export function attribute(node, name) {
  return node.attrs?.find((attr) => attr.name === name)?.value;
}

export async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  }))).flat();
}

const markdown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
markdown.remove(['script', 'style', 'svg', 'iframe']);
markdown.addRule('tables', {
  filter: 'table',
  replacement(_content, node) {
    const rows = Array.from(node.querySelectorAll('tr')).map((row) =>
      Array.from(row.querySelectorAll('th, td')).map((cell) =>
        markdown.turndown(cell.innerHTML).replace(/\n/g, ' ').replace(/\|/g, '\\|')));
    if (!rows.length) return '';
    const width = Math.max(...rows.map((row) => row.length));
    const line = (row) => `| ${Array.from({ length: width }, (_, i) => row[i] ?? '').join(' | ')} |`;
    return `\n\n${line(rows[0])}\n${line(Array(width).fill('---'))}\n${rows.slice(1).map(line).join('\n')}\n\n`;
  },
});

export async function buildAgentContent(directory) {
  const urls = [];
  const publicContent = [];
  for (const file of await htmlFiles(directory)) {
    const nodes = elements(parse(await readFile(file, 'utf8')));
    const canonical = attribute(nodes.find((node) => node.tagName === 'link' && attribute(node, 'rel') === 'canonical'), 'href');
    const main = nodes.find((node) => node.tagName === 'main');
    if (!canonical || !main) throw new Error(`Missing canonical or main: ${relative(directory, file)}`);
    for (const node of elements(main)) {
      for (const attr of node.attrs ?? []) {
        if (['href', 'src'].includes(attr.name)) attr.value = new URL(attr.value, canonical).href;
      }
    }
    const description = attribute(nodes.find((node) => node.tagName === 'meta' && attribute(node, 'name') === 'description'), 'content');
    const body = `Source: ${canonical}\n\n${description}\n\n${markdown.turndown(serialize(main))}\n`;
    await writeFile(file.replace(/\.html$/, '.md'), body);
    const noindex = nodes.some((node) => node.tagName === 'meta' && attribute(node, 'name') === 'robots' && /noindex/i.test(attribute(node, 'content') ?? ''));
    if (!noindex) {
      urls.push(canonical);
      publicContent.push({ canonical, body });
    }
  }
  const escapeXml = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  await writeFile(join(directory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.sort().map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
  const guide = await readFile(join(directory, 'llms.txt'), 'utf8');
  publicContent.sort((a, b) => a.canonical.localeCompare(b.canonical));
  await writeFile(join(directory, 'llms-full.txt'), `${guide}\n\n## Full public content\n\n${publicContent.map(({ body }) => body).join('\n---\n\n')}`);
  console.log(`Generated Markdown for every HTML page and a sitemap with ${urls.length} indexable URLs.`);
}

if (process.argv[1]?.endsWith('build-agent-content.mjs')) await buildAgentContent('dist');
