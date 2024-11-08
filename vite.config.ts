import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(() => ({
  base: "/function-to-class/",
  plugins: [
    nodePolyfills()
  ],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
}));
