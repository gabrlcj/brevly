import { randomUUID } from 'node:crypto'
import type { InferInsertModel } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { env } from '@/infra/env'

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const result = await db
    .insert(schema.links)
    .values({
      shortUrl: `${randomUUID()}`,
      originalUrl: `http://localhost:${env.PORT}/${randomUUID()}`,
      ...overrides,
    })
    .returning()

  return result[0]
}
