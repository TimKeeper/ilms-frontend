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
            // target: 'http://127.0.0.1:9090',
            ws: true,
          },
          '/ws': {
            changeOrigin: true,
            target: 'ws://nas.bigjin.cc:34091',
            // target: 'ws://127.0.0.1:9091',
            ws: true,
          },
        },
      },
    },
  };
});
