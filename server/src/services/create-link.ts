import { eq, InferSelectModel } from 'drizzle-orm'
import { z } from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { ShortUrlAlreadyExists } from './errors/short-url-already-exists'

export const createLinkSchema = z.object({
  originalUrl: z.url(),
  shortUrl: z.string(),
})

type CreateLinkInput = z.infer<typeof createLinkSchema>

type CreateLinkOutput = InferSelectModel<typeof schema.links>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<ShortUrlAlreadyExists, CreateLinkOutput>> {
  const { originalUrl, shortUrl } = createLinkSchema.parse(input)

  const existingLink = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (existingLink) {
    return makeLeft(new ShortUrlAlreadyExists())
  }

  const result = await db
    .insert(schema.links)
    .values({
      originalUrl,
      shortUrl,
    })
    .returning()

  const link = result[0]

  return makeRight(link)
}
