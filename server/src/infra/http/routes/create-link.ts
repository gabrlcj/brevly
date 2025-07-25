import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { createLink } from '@/services/create-link'
import { isRight, unwrapEither } from '@/shared/either'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create link with shortened URL',
        tags: ['links'],
        body: z.object({
          originalUrl: z.url({
            protocol: /^https?$/,
            hostname: z.regexes.domain,
          }),
          shortUrl: z.string(),
        }),
        response: {
          201: z.object({
            id: z.uuid(),
            originalUrl: z.url(),
            shortUrl: z.string(),
            accessCount: z.int(),
            createdAt: z.date(),
          }),
          400: z.object({ message: z.string() }),
          409: z
            .object({ message: z.string() })
            .describe('Short url already exists.'),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      if (!originalUrl || !shortUrl) {
        return reply.status(400).send({ message: 'Both urls are required.' })
      }

      const result = await createLink({ originalUrl, shortUrl })

      if (isRight(result)) {
        return reply.status(201).send({
          id: unwrapEither(result).id,
          originalUrl: unwrapEither(result).originalUrl,
          shortUrl: unwrapEither(result).shortUrl,
          accessCount: unwrapEither(result).accessCount,
          createdAt: unwrapEither(result).createdAt,
        })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ShortUrlAlreadyExists':
          return reply.status(409).send({ message: error.message })
      }
    }
  )
}
