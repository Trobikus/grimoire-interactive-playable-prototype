import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/grimoire-interactive-playable-prototype/" : "./",
  build: { target: "es2022" },
});
