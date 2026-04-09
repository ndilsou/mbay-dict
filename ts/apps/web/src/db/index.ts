import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'

type Db =
  | ReturnType<typeof drizzleNeon<typeof schema>>
  | ReturnType<typeof drizzlePg<typeof schema>>

let _db: Db

export function getDb(): Db {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL not set')

    if (url.includes('neon.tech') || url.includes('neon.')) {
      const sql = neon(url)
      _db = drizzleNeon(sql, { schema })
    } else {
      const pool = new pg.Pool({ connectionString: url })
      _db = drizzlePg(pool, { schema })
    }
  }
  return _db
}
