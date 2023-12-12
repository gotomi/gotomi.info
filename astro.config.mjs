import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [svelte(), react()],
  site: "http://gotomi.info/",
});
