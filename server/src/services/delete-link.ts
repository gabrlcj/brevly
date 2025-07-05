import { eq } from 'drizzle-orm'
import { z } from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { NotFound } from './errors/not-found'

export const deleteLinkSchema = z.object({
  shortUrl: z.string(),
})

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<NotFound, object>> {
  const { shortUrl } = deleteLinkSchema.parse(input)

  const existingLink = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (!existingLink) {
    return makeLeft(new NotFound())
  }

  await db.delete(schema.links).where(eq(schema.links.shortUrl, shortUrl))

  return makeRight({})
}
