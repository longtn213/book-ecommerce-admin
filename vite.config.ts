import path from 'path';
import { defineConfig } from 'vite';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig({
  plugins: [],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
});
