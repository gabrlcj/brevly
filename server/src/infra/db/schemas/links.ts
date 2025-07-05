import * as pg from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const links = pgTable('links', {
  id: pg
    .text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  shortUrl: pg.text('short_url').notNull().unique(),
  originalUrl: pg.text('original_url').notNull(),
  accessCount: pg.integer('access_count').notNull().default(0),
  createdAt: pg.timestamp('created_at').notNull().defaultNow(),
})
