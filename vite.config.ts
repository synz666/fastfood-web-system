import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/fastfood-web-system/',
  server: {
    port: 5173,
  },
});
