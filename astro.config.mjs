// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://scrumday.ng',
  // Guessable URLs for an event site — send them somewhere useful instead of the 404.
  redirects: {
    '/tickets': '/#tickets',
    '/register': '/#tickets',
    '/agenda': '/schedule',
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [vue(), mdx(), sitemap()]
});