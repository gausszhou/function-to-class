import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import 'dotenv/config';

export default defineConfig(() => ({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [nodePolyfills()],
  clearScreen: false,
  server: {
    port: 1998,
    strictPort: true,
  },
  build: {
    outDir: process.env.VITE_BUILD_DIR || 'dist',
  },
}));
