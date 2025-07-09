import { asc, desc, ilike } from 'drizzle-orm'
import { z } from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'

export const fetchLinksSchema = z.object({
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().optional().default(20),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  searchQuery: z.string().optional(),
})

type FetchLinksInput = z.infer<typeof fetchLinksSchema>

type FetchLinksOutput = {
  links: {
    id: string
    shortUrl: string
    originalUrl: string
    accessCount: number
    createdAt: Date
  }[]
  total: number
}

export async function fetchLinks(
  input: FetchLinksInput
): Promise<Either<never, FetchLinksOutput>> {
  const { page, pageSize, sortBy, sortDirection, searchQuery } =
    fetchLinksSchema.parse(input)

  const [links, total] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        shortUrl: schema.links.shortUrl,
        originalUrl: schema.links.originalUrl,
        accessCount: schema.links.accessCount,
        createdAt: schema.links.createdAt,
      })
      .from(schema.links)
      .where(
        searchQuery
          ? ilike(schema.links.originalUrl, `%${searchQuery}%`)
          : undefined
      )
      .orderBy(columns => {
        if (sortBy && sortDirection === 'asc') {
          return asc(columns[sortBy])
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(columns[sortBy])
        }

        return desc(columns.id)
      })
      .limit(pageSize)
      .offset((page - 1) * pageSize),

    db.$count(schema.links),
  ])

  return makeRight({ links, total })
}
