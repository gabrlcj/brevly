import type { Config } from 'drizzle-kit'
import { env } from '@/infra/env'

export default {
  dbCredentials: { url: env.DATABASE_URL },
  out: 'src/infra/db/migrations',
  schema: 'src/infra/db/schemas/*',
  dialect: 'postgresql',
} satisfies Config
