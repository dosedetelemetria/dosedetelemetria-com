// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      // Enable default base styles for easier setup
      applyBaseStyles: true,
    })
  ],
  // Configure Vite for better React support
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  }
});
