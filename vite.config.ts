import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    // Conditionally enable source maps only in non-production environments
    sourcemap: process.env.NODE_ENV !== 'production',
    outDir: 'dist', // Specify the output directory
  },
});
