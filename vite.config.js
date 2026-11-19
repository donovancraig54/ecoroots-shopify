import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // only scan the React app – ./site is the raw static mirror used by tools/extract.mjs
  optimizeDeps: { entries: ['index.html'] },
  server: {
    port: 5180,
    host: true,
    allowedHosts: true,
    strictPort: true
  },
});
