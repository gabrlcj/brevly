import { eq, InferSelectModel } from 'drizzle-orm'
import { z } from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { NotFound } from './errors/not-found'

export const getLinkByShortUrlSchema = z.object({
  shortUrl: z.string(),
})

type GetLinkByShortUrlInput = z.infer<typeof getLinkByShortUrlSchema>

type CreateLinkOutput = InferSelectModel<typeof schema.links>

export async function getLinkByShortUrl(
  input: GetLinkByShortUrlInput
): Promise<Either<NotFound, CreateLinkOutput>> {
  const { shortUrl } = getLinkByShortUrlSchema.parse(input)

  const existingLink = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (!existingLink) {
    return makeLeft(new NotFound())
  }

  return makeRight(existingLink)
}
