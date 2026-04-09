import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import neon from './neon-vite-plugin.ts'

// Skip neon plugin when using local postgres (docker)
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
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
})

export default config
