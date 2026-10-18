// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { rehypeLegacyHeadings } from './src/lib/rehype-legacy-headings.mjs';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://dosedetelemetria.com',
  integrations: [react()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [rehypeLegacyHeadings, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
    }),
    shikiConfig: { theme: 'github-dark-default' },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: { include: ['react', 'react-dom'] },
    resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  },
});
