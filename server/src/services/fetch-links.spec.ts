import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { fetchLinks } from './fetch-links'
import { randomUUID } from 'node:crypto'

describe('fetch links', () => {
  it('should use default sorting (id desc) if no sortBy/sortDirection provided', async () => {
    const originalUrlPattern = `http://${randomUUID()}.com`
    const link1 = await makeLink({ originalUrl: originalUrlPattern })
    const link2 = await makeLink({ originalUrl: originalUrlPattern })
    const link3 = await makeLink({ originalUrl: originalUrlPattern })

    const sut = await fetchLinks({
      page: 1,
      pageSize: 3,
      searchQuery: originalUrlPattern,
    })

    expect(isRight(sut)).toBe(true)

    expect(unwrapEither(sut).links.length).toEqual(3)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })

  it('should return paginated links', async () => {
    const originalUrlPattern = `http://${randomUUID()}.com`
    const link1 = await makeLink({ originalUrl: originalUrlPattern })
    const link2 = await makeLink({ originalUrl: originalUrlPattern })
    const link3 = await makeLink({ originalUrl: originalUrlPattern })
    const link4 = await makeLink({ originalUrl: originalUrlPattern })
    const link5 = await makeLink({ originalUrl: originalUrlPattern })

    let sut = await fetchLinks({
      page: 1,
      pageSize: 3,
      searchQuery: originalUrlPattern,
    })

    expect(isRight(sut)).toBe(true)

    expect(unwrapEither(sut).links.length).toEqual(3)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
    ])

    sut = await fetchLinks({
      page: 2,
      pageSize: 3,
      searchQuery: originalUrlPattern,
    })

    expect(isRight(sut)).toBe(true)

    expect(unwrapEither(sut).links.length).toEqual(2)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })

  it('should return sorted links by both sort directions', async () => {
    const base = dayjs()
    const originalUrlPattern = `http://${randomUUID()}.com`
    const link1 = await makeLink({
      createdAt: base.toDate(),
      originalUrl: originalUrlPattern,
    })
    const link2 = await makeLink({
      createdAt: base.add(1, 'day').toDate(),
      originalUrl: originalUrlPattern,
    })
    const link3 = await makeLink({
      createdAt: base.add(2, 'day').toDate(),
      originalUrl: originalUrlPattern,
    })

    let sut = await fetchLinks({
      page: 1,
      pageSize: 3,
      sortBy: 'createdAt',
      sortDirection: 'asc',
      searchQuery: originalUrlPattern,
    })

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
      searchQuery: originalUrlPattern,
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
