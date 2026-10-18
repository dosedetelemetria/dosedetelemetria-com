import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const other = process.argv[2];
if (!other) throw new Error('Pass the other website checkout: bun run compare:site /path/to/other/site');
const paths = JSON.parse(await readFile('scripts/site-alignment.json', 'utf8'));
const differences = [];
for (const path of paths) {
  try {
    const [local, remote] = await Promise.all([readFile(path, 'utf8'), readFile(resolve(other, path), 'utf8')]);
    if (local !== remote) differences.push(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    differences.push(`${path} (missing)`);
  }
}
if (differences.length) {
  console.error(`Website implementation drift:\n${differences.join('\n')}`);
  process.exitCode = 1;
} else console.log(`${paths.length} common implementation files match exactly. Brand/content/integration files are intentionally excluded.`);
