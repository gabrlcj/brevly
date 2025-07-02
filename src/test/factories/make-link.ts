import { randomUUID } from 'node:crypto'
import type { InferInsertModel } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const result = await db
    .insert(schema.links)
    .values({
      shortUrl: `${randomUUID()}`,
      originalUrl: `http://localhost:3333/${randomUUID()}`,
      ...overrides,
    })
    .returning()

  return result[0]
}
