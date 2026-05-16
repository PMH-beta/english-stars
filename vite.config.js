import { defineConfig } from 'vite';

export default defineConfig({
  // Wichtig für GitHub Pages: base-path so dass es unter pmh-beta.github.io/english-stars/ funktioniert
  base: './',
  build: {
    // Output direkt nach docs/ damit GitHub Pages das einfach servieren kann
    outDir: 'dist',
    emptyOutDir: true,
    // Damit MP3 + Icon-Pfade einfach bleiben
    assetsDir: 'assets'
  },
  server: {
    port: 5173,
    open: true
  }
});
