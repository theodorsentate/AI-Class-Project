import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";
const r = (p: string) => path.resolve(__dirname, p);
export default defineConfig({
  plugins: [react(), tailwind(), viteSingleFile()],
  resolve: { alias: { "@": r("src"), "next/link": r("src/shims/link.tsx"), "next/navigation": r("src/shims/navigation.ts"), "next/font/google": r("src/shims/font.ts") } },
  build: { target: "es2020", assetsInlineLimit: 100000000 },
});
