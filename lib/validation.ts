import { z } from 'zod'

export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(50, 'Slug must be at most 50 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Slug can only contain letters, numbers, hyphens, and underscores'
  )
  .transform((val) => val.toLowerCase())

export const createClipSchema = z.object({
  slug: slugSchema,
  content: z.string().optional(),
  ttl: z.enum(['1min', '10min', '1hour', '1day', '1week', '1month']).optional(),
  destroyOnRead: z.boolean().default(true),
})

export type CreateClipInput = z.infer<typeof createClipSchema>

