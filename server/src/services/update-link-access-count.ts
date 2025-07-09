import { eq } from 'drizzle-orm'
import { z } from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { NotFound } from './errors/not-found'

export const updateLinkAccessCountSchema = z.object({
  shortUrl: z.string(),
})

type UpdateLinkAccessCountInput = z.infer<typeof updateLinkAccessCountSchema>

export async function updateLinkAccessCount(
  input: UpdateLinkAccessCountInput
): Promise<Either<NotFound, object>> {
  const { shortUrl } = updateLinkAccessCountSchema.parse(input)

  const existingLink = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (!existingLink) {
    return makeLeft(new NotFound())
  }

  existingLink.accessCount++

  await db
    .update(schema.links)
    .set({ accessCount: existingLink.accessCount })
    .where(eq(schema.links.id, existingLink.id))

  return makeRight({})
}
