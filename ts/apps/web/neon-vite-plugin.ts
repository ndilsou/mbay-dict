import { postgres } from 'vite-plugin-neon-new'

export default postgres({
  seed: {
    type: 'sql-script',
    path: 'db/init.sql',
  },
  referrer: 'github:ndilsou/mbay-dict',
  dotEnvKey: 'DATABASE_URL',
})
