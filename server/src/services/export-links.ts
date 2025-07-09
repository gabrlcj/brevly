import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { ilike } from 'drizzle-orm'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { Either, makeRight } from '@/shared/either'
import { z } from 'zod/v4'

const exportLinksSchema = z.object({
  searchQuery: z.string().optional(),
})

type ExportLinksInput = z.infer<typeof exportLinksSchema>

export async function exportLinks({
  searchQuery,
}: ExportLinksInput): Promise<Either<never, { url: string }>> {
  const { sql, params } = db
    .select({
      originalUrl: schema.links.originalUrl,
      shortUrl: schema.links.shortUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .where(
      searchQuery
        ? ilike(schema.links.originalUrl, `%${searchQuery}%`)
        : undefined
    )
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(2)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'original_url', header: 'URL original' },
      { key: 'short_url', header: 'URL encurtada' },
      { key: 'access_count', header: 'Quantidade de acessos' },
      { key: 'created_at', header: 'Data de criação' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCsvPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks, _encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    folder: 'downloads',
    contentStream: uploadToStorageStream,
    contentType: 'text/csv',
    fileName: `links-${new Date().toISOString()}.csv`,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCsvPipeline])

  return makeRight({ url })
}
