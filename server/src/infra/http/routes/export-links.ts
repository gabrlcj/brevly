import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { exportLinks } from '@/services/export-links'
import { unwrapEither } from '@/shared/either'

export const exportLinksRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links/export',
    {
      schema: {
        summary: 'Export all links',
        tags: ['links'],
        querystring: z.object({ searchQuery: z.string().optional() }),
        response: {
          200: z.object({ url: z.url() }),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery } = request.query

      const result = await exportLinks({ searchQuery })

      return reply.status(200).send({ url: unwrapEither(result).url })
    }
  )
}
