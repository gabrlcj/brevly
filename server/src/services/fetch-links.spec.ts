import dayjs from 'dayjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { fetchLinks } from './fetch-links'

describe('fetch links', () => {
  // beforeEach(async () => {
  //   await db.delete(schema.links)
  // })

  it('should use default sorting (id desc) if no sortBy/sortDirection provided', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()

    const sut = await fetchLinks({ page: 1, pageSize: 3 })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links.length).toEqual(3)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link3.id, shortUrl: link3.shortUrl }),
      expect.objectContaining({ id: link2.id, shortUrl: link2.shortUrl }),
      expect.objectContaining({ id: link1.id, shortUrl: link1.shortUrl }),
    ])
  })

  it('should return paginated links', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()
    const link4 = await makeLink()
    const link5 = await makeLink()

    let sut = await fetchLinks({ page: 1, pageSize: 3 })

    expect(isRight(sut)).toBe(true)

    expect(unwrapEither(sut).links.length).toEqual(3)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id, shortUrl: link5.shortUrl }),
      expect.objectContaining({ id: link4.id, shortUrl: link4.shortUrl }),
      expect.objectContaining({ id: link3.id, shortUrl: link3.shortUrl }),
    ])

    sut = await fetchLinks({ page: 2, pageSize: 2 })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links.length).toEqual(2)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link2.id, shortUrl: link2.shortUrl }),
      expect.objectContaining({ id: link1.id, shortUrl: link1.shortUrl }),
    ])
  })

  it('should return sorted links by both sort directions', async () => {
    const base = dayjs()
    const link1 = await makeLink({ createdAt: base.toDate() })
    const link2 = await makeLink({ createdAt: base.add(1, 'day').toDate() })
    const link3 = await makeLink({ createdAt: base.add(2, 'day').toDate() })

    let sut = await fetchLinks({
      page: 1,
      pageSize: 3,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })
    console.log(sut.right)

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links.length).toEqual(3)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link1.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link3.id }),
    ])

    sut = await fetchLinks({
      page: 1,
      pageSize: 3,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links.length).toEqual(3)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })
})
