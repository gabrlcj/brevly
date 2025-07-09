import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { isRight, unwrapEither } from '@/shared/either'
import { updateLinkAccessCount } from '@/services/update-link-access-count'

export const updateLinkAccessCountRoute: FastifyPluginAsyncZod = async server => {
  server.put(
    '/:shortUrl/increment',
    {
      schema: {
        summary: 'Updates link access count',
        tags: ['links'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          204: z.object({}),
          404: z.object({ message: z.string() }).describe('Link not found.'),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const result = await updateLinkAccessCount({ shortUrl })

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
