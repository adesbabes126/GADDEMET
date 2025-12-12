import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Use fallback to empty string to prevent build breaking or runtime 'process is not defined' error
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});