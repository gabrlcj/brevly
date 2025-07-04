import { randomUUID } from 'node:crypto'
import { basename, extname } from 'node:path'
import { Readable } from 'node:stream'
import { Upload } from '@aws-sdk/lib-storage'
import { z } from 'zod/v4'
import { env } from '../env'
import { r2 } from './client'

const uploadFileToStorageSchema = z.object({
  folder: z.enum(['downloads']).default('downloads'),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadFileToStorageInput = z.infer<typeof uploadFileToStorageSchema>

export async function uploadFileToStorage(input: UploadFileToStorageInput) {
  const { folder, fileName, contentType, contentStream } =
    uploadFileToStorageSchema.parse(input)

  const fileExtension = extname(fileName)
  const fileNameWithoutExtension = basename(fileName, fileExtension)
  const sanitazedFileName = fileNameWithoutExtension.replace(/^a-zA-Z0-9/g, '')
  const sanitazedFileNameWithExtension = sanitazedFileName.concat(fileExtension)

  const uniqueFileName = `${folder}/${randomUUID()}-${sanitazedFileNameWithExtension}`

  const result = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  })

  await result.done()

  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
  }
}
