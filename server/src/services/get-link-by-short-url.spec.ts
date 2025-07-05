import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { NotFound } from './errors/not-found'
import { getLinkByShortUrl } from './get-link-by-short-url'

describe('get link by short URL', () => {
  it('should be able to get a link with short URL', async () => {
    const link = await makeLink({ originalUrl: 'http://example.com' })

    const sut = await getLinkByShortUrl({ shortUrl: link.shortUrl })

    expect(isRight(sut)).toBe(true)
    expect(sut.right?.originalUrl).toEqual('http://example.com')
  })

  it('should throw an exception when link is not found', async () => {
    const sut = await getLinkByShortUrl({ shortUrl: '' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(NotFound)
  })
})
