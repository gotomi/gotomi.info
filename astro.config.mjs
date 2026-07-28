import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [svelte()],
  site: "http://gotomi.info/",
});
