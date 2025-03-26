import { reactRouter } from '@react-router/dev/vite';
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    cloudflareDevProxy({
      getLoadContext({ context }) {
        return { cloudflare: context.cloudflare };
      },
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        icon: false,
        memo: true,
        expandProps: 'end',
        svgoConfig: {
          floatPrecision: 2,
          plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }],
        },
      },
      include: '**/*.svg?react',
    }),
  ],
});
