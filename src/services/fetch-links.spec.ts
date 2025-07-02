import dayjs from 'dayjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { fetchLinks } from './fetch-links'

async function clearLinksTable() {
  await db.delete(schema.links)
}

describe('fetch links', () => {
  beforeEach(async () => {
    await clearLinksTable()
  })

  it('should return empty array if no links exist', async () => {
    const sut = await fetchLinks({ page: 1, pageSize: 10 })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toEqual([])
    expect(unwrapEither(sut).total).toBe(0)
  })

  it('should return correct total count', async () => {
    await makeLink()
    await makeLink()
    await makeLink()

    const sut = await fetchLinks({ page: 1, pageSize: 10 })
    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(3)
  })

  it('should use default sorting (id desc) if no sortBy/sortDirection provided', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()

    const sut = await fetchLinks({ page: 1, pageSize: 3 })
    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
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
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
    ])

    sut = await fetchLinks({ page: 2, pageSize: 3 })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links.length).toEqual(2)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
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
