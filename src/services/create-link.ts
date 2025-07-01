import { eq } from 'drizzle-orm'
import { z } from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { env } from '@/infra/env'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { ShortUrlAlreadyExists } from './errors/short-url-already-exists'

export const createLinkSchema = z.object({
  originalUrl: z.url(),
  shortUrl: z.string(),
})

type CreateLinkInput = z.infer<typeof createLinkSchema>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<ShortUrlAlreadyExists, { url: string }>> {
  const { originalUrl, shortUrl } = createLinkSchema.parse(input)

  const existingLink = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (existingLink) {
    return makeLeft(new ShortUrlAlreadyExists())
  }

  await db.insert(schema.links).values({
    originalUrl,
    shortUrl,
  })

  return makeRight({ url: `http://localhost:${env.PORT}/${shortUrl}` })
}
