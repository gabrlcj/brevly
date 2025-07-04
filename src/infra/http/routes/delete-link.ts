import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { deleteLink } from '@/services/delete-link'
import { isRight, unwrapEither } from '@/shared/either'

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/:shortUrl',
    {
      schema: {
        summary: 'Delete link by short URL',
        tags: ['links'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          204: z.object({}),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }).describe('Link not found.'),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      if (!shortUrl) {
        return reply.status(400).send({ message: 'Short URL not provided.' })
      }

      const result = await deleteLink({ shortUrl })

      if (isRight(result)) {
        return reply.status(204).send({})
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'NotFound':
          return reply.status(404).send({ message: error.message })
      }
    }
  )
}
