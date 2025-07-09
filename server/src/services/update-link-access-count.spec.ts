import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { NotFound } from './errors/not-found'
import { updateLinkAccessCount } from './update-link-access-count'

describe('update link access count', () => {
  it('should be able to update the access count of a link', async () => {
    const link = await makeLink({ originalUrl: 'http://example.com' })

    const sut = await updateLinkAccessCount({ shortUrl: link.shortUrl })

    expect(isRight(sut)).toBe(true)
  })

  it('should throw an exception when link is not found', async () => {
    const sut = await updateLinkAccessCount({ shortUrl: '' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(NotFound)
  })
})
