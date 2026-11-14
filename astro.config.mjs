// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://scrumday.ng',
  // Pages stay prerendered; only routes with `export const prerender = false` (ticket checkout)
  // run as Vercel functions.
  adapter: vercel(),
  env: {
    schema: {
      // Paystack secret key (sk_test_... / sk_live_...). Set it in Vercel > Settings > Environment
      // Variables, never in the repo. Unset = checkout responds "payments unavailable".
      PAYSTACK_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
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