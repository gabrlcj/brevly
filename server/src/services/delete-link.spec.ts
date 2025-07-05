import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { deleteLink } from './delete-link'
import { NotFound } from './errors/not-found'

describe('delete link', () => {
  it('should be able to delete an existing link', async () => {
    const link = await makeLink()

    const sut = await deleteLink({ shortUrl: link.shortUrl })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({})
  })

  it('should return an error if link is not found', async () => {
    const sut = await deleteLink({ shortUrl: 'not-found' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(NotFound)
  })
})
