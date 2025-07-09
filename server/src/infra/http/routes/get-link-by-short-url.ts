import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { getLinkByShortUrl } from '@/services/get-link-by-short-url'
import { isRight, unwrapEither } from '@/shared/either'

export const getLinkByShortUrlRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/:shortUrl',
    {
      schema: {
        summary: 'Get original link by short URL',
        tags: ['links'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          200: z.object({
            id: z.uuid(),
            originalUrl: z.url(),
            shortUrl: z.string(),
            accessCount: z.int(),
            createdAt: z.date(),
          }),
          404: z.object({ message: z.string() }).describe('Link not found.'),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const result = await getLinkByShortUrl({ shortUrl })

      if (isRight(result)) {
        return reply.status(200).send({
          id: unwrapEither(result).id,
          originalUrl: unwrapEither(result).originalUrl,
          shortUrl: unwrapEither(result).shortUrl,
          accessCount: unwrapEither(result).accessCount,
          createdAt: unwrapEither(result).createdAt,
        })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'NotFound':
          return reply.status(404).send({ message: error.message })
      }
    }
  )
}
