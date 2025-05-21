import { z } from '@hono/zod-openapi'

export const hashSchema = z.string()
  .regex(/^[a-f0-9]{32}$/, 'Invalid MD5 hash')

export const emailSchema = z.string()
  .email('Invalid email')
  .transform(v => v.trim().toLowerCase())
