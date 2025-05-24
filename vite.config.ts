import { cloudflare } from '@cloudflare/vite-plugin'
import build from '@hono/vite-build/cloudflare-workers'
import { defineConfig } from 'vite'
import ssrHotReload from 'vite-plugin-ssr-hot-reload'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'

export default defineConfig(({ command, isSsrBuild }) => {
  if (command === 'serve') {
    return { plugins: [ssrHotReload(), cloudflare()] }
  }
  if (!isSsrBuild) {
    return {
      build: {
        rollupOptions: {
          input: ['./src/style.css'],
          output: {
            assetFileNames: 'assets/[name].[ext]',
          },
        },
      },
    }
  }
  return {
    // @ts-expect-error Hono setting
    plugins: [wasm(), topLevelAwait(), build({ outputDir: 'dist-server' })],
    build: {
      outDir: 'dist-server',
      rollupOptions: {
        external: [
          '@jsquash/avif',
          '@jsquash/jpeg',
          '@jsquash/png',
          '@jsquash/webp',
          '/wasm/avif_enc.wasm',
          '/wasm/mozjpeg_dec.wasm',
          '/wasm/squoosh_png_bg.wasm',
          '/wasm/webp_enc_simd.wasm',
        ],
      },
    },
  }
})
