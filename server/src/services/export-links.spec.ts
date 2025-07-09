import { randomUUID } from 'node:crypto'
import * as uploads from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { exportLinks } from './export-links'

describe('export links', () => {
  it('should be able to export a CSV of the links', async () => {
    const uploadStub = vi
      .spyOn(uploads, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: `http://example.com/downloads/file.csv`,
        }
      })

    const originalUrlPattern = `http://${randomUUID()}.com`
    const link1 = await makeLink({ originalUrl: originalUrlPattern })
    const link2 = await makeLink({ originalUrl: originalUrlPattern })
    const link3 = await makeLink({ originalUrl: originalUrlPattern })
    const link4 = await makeLink({ originalUrl: originalUrlPattern })
    const link5 = await makeLink({ originalUrl: originalUrlPattern })

    const sut = await exportLinks({ searchQuery: originalUrlPattern })

    const generatedCsvStream = uploadStub.mock.calls[0][0].contentStream
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCsvStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCsvStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCsvStream.on('error', err => {
        reject(err)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).url).toEqual(
      'http://example.com/downloads/file.csv'
    )
    expect(csvAsArray).toEqual([
      [
        'URL original',
        'URL encurtada',
        'Quantidade de acessos',
        'Data de criação',
      ],
      [
        link1.originalUrl,
        link1.shortUrl,
        expect.any(String),
        expect.any(String),
      ],
      [
        link2.originalUrl,
        link2.shortUrl,
        expect.any(String),
        expect.any(String),
      ],
      [
        link3.originalUrl,
        link3.shortUrl,
        expect.any(String),
        expect.any(String),
      ],
      [
        link4.originalUrl,
        link4.shortUrl,
        expect.any(String),
        expect.any(String),
      ],
      [
        link5.originalUrl,
        link5.shortUrl,
        expect.any(String),
        expect.any(String),
      ],
    ])
  })
})
