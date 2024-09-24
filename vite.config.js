import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'build', // Cambia 'dist' a 'build'
    chunkSizeWarningLimit: 1000, // Aumenta el límite del tamaño de chunk a 1000 kB
  },
});
