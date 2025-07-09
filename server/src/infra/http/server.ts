import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportLinksRoute } from './routes/export-links'
import { fetchLinksRoute } from './routes/fetch-links'
import { getLinkByShortUrlRoute } from './routes/get-link-by-short-url'

const server = fastify()

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation,
    })
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brevly server',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(createLinkRoute)
server.register(deleteLinkRoute)
server.register(fetchLinksRoute)
server.register(getLinkByShortUrlRoute)
server.register(exportLinksRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server is running!')
})
