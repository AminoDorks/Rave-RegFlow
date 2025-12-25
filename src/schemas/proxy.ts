import { z } from 'zod';

export const TorProxySchema = z.object({
  proxy: z.string(),
  timesUsed: z.number(),
});

export type TorProxy = z.infer<typeof TorProxySchema>;
