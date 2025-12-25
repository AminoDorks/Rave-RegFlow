import { z } from 'zod/mini';

export const CachedAccountSchema = z.object({
  email: z.string(),
  deviceId: z.string(),
  token: z.string(),
});

export const CacheSchema = z.object({
  accounts: z.array(CachedAccountSchema),
});

export type Cache = z.infer<typeof CacheSchema>;
export type CachedAccount = z.infer<typeof CachedAccountSchema>;
