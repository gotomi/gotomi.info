import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [svelte(), sitemap()],
  site: "https://gotomi.info",
});
