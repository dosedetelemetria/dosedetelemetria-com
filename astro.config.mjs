// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://dosedetelemetria.com',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: { include: ['react', 'react-dom'] },
    resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  },
});
