import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// -------------------------------------------------------
// FinWorld Production Vite Configuration
// -------------------------------------------------------
// - React plugin enabled
// - PostCSS integration
// - Cache-busting build filenames for Azure Static Web Apps
// - Alias setup for simplified imports
// - Dev server port 5173
// -------------------------------------------------------

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  root: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash][extname]",
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
