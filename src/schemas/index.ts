import { z } from '@hono/zod-openapi'

export const hashSchema = z.string()
  .regex(/^[a-f0-9]{32}$|^[a-f0-9]{64}$/, 'Invalid hash (must be MD5 or SHA-256)')

export const emailSchema = z.string()
  .email('Invalid email')
  .transform(v => v.trim().toLowerCase())
