import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // keep the React plugin you already use (plugin-react or plugin-react-swc)
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173, host: true },
  build: { sourcemap: false, chunkSizeWarningLimit: 900 },
});
