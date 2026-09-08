// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://scrumday.ng',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [vue(), mdx(), sitemap()]
});