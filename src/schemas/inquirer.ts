import { z } from 'zod';

type filter = (value: string) => boolean;

export const ChoiceSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string(),
});

export const InputCustomConfigSchema = z.object({
  defaultAnswer: z.string().optional(),
  required: z.boolean().optional(),
  filter: z.custom<filter>().optional(),
});

export type Choice = z.infer<typeof ChoiceSchema>;
export type InputCustomConfig = z.infer<typeof InputCustomConfigSchema>;
