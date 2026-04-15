import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import neon from './neon-vite-plugin.ts'

// Skip neon provisioning plugin when using local postgres (docker)
const useLocalDb = !!process.env.DATABASE_URL?.includes('localhost')

const config = defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    ...(useLocalDb ? [] : [neon]),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        pages: [
          { path: '/' },
          { path: '/mb-fr/index/a' },
          { path: '/mb-en/index/a' },
          { path: '/fr-mb/index/a' },
          { path: '/en-mb/index/a' },
        ],
      },
    }),
    nitro(),
    viteReact(),
  ],
})

export default config
