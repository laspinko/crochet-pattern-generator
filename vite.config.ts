import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: { outDir: "build" },
  base: "/crochet-pattern-generator/",
  plugins: [react()],
});
