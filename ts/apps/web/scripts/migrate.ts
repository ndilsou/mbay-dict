import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL required')
  process.exit(1)
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false,
})

async function main() {
  await client.connect()
  console.log('Connected.')

  const db = drizzle(client)
  console.log('Running migrations...')
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migrations complete.')

  await client.end()
}

main().catch(async (err) => {
  console.error('Migration failed:', err)
  await client.end()
  process.exit(1)
})
