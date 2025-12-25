import z from 'zod';

export const LocaleSchema = z.object({
  logo: z.string(),
});

export type Locale = z.infer<typeof LocaleSchema>;
