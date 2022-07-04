import { defineConfig } from 'astro/config';
import deno from '@astrojs/deno';
import svelte from '@astrojs/svelte';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
    integrations: [svelte()],
    adapter: deno(),
    site: 'http://gotomi.info/',
  });