import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    strictPort: true,
    port: 5173,
    // Allow Docker internal hostnames like "app"
    origin: 'http://app:5173',
    hmr: {
      host: 'localhost', // or your host IP if using HMR externally
    },
    headers: {
      'Access-Control-Allow-Origin': '*', // optional
    },
  },
});
