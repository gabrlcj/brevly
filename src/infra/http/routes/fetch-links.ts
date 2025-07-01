import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { fetchLinks } from '@/services/fetch-links'
import { unwrapEither } from '@/shared/either'

export const fetchLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Fetch list of registered links',
        querystring: z.object({
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20),
          sortBy: z.enum(['createdAt']).optional(),
          sortDirection: z.enum(['asc', 'desc']).optional(),
        }),
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.uuidv7(),
                shortUrl: z.string(),
                originalUrl: z.url(),
                accessCount: z.number(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, pageSize, sortBy, sortDirection } = request.query

      const result = await fetchLinks({
        page,
        pageSize,
        sortBy,
        sortDirection,
      })

      const { links, total } = unwrapEither(result)

      return reply.status(200).send({ links, total })
    }
  )
}
