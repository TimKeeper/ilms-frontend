import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            target: 'http://nas.bigjin.cc:34090',
            ws: true,
          },
          '/ws': {
            changeOrigin: true,
            target: 'ws://nas.bigjin.cc:34091',
            ws: true,
          },
        },
      },
    },
  };
});
