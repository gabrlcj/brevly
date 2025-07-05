import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { createLink } from './create-link'
import { ShortUrlAlreadyExists } from './errors/short-url-already-exists'

describe('create link', () => {
  it('should be able to create a link', async () => {
    const sut = await createLink({
      originalUrl: 'https://google.com',
      shortUrl: `create-test-${randomUUID()}`,
    })

    expect(isRight(sut)).toBe(true)
  })

  it('should not be able to create a link with duplicate short URL', async () => {
    const link = await makeLink()

    const sut = await createLink({
      originalUrl: 'http://google.com',
      shortUrl: link.shortUrl,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ShortUrlAlreadyExists)
  })
})
