import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import 'dotenv/config';

export default defineConfig(() => ({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [
    react(), // Add React plugin
    nodePolyfills()
  ],
  clearScreen: false,
  server: {
    port: 1998,
    strictPort: true
  },
  build: {
    outDir: process.env.VITE_BUILD_DIR || 'dist'
  },
  resolve: {
    extensions: ['.js', '.ts', '.json', '.jsx', '.tsx', '.css', '.txt', '.md']
  }
}));
