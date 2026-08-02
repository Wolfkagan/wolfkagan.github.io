import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "../build-output",
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: true,
  },
});
