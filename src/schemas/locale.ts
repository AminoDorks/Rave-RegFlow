import z from 'zod';
import { ChoiceSchema } from './inquirer';

export const LocaleSchema = z.object({
  logo: z.string(),
  logoCredit: z.string(),
  enters: z.object({
    chooseAction: z.string(),
    chooseLanguage: z.string(),
    enterTorPort: z.string(),
    enterTorPassword: z.string(),
  }),
  logs: z.object({
    cacheUpdated: z.string(),
    torConnected: z.string(),
    newNym: z.string(),
    proxyConnected: z.string(),
  }),
  errors: z.object({
    torConnectionFailed: z.string(),
    proxyConnectionFailed: z.string(),
  }),
  choices: z.object({
    main: z.array(ChoiceSchema),
    settings: z.array(ChoiceSchema),
    languages: z.array(ChoiceSchema),
  }),
});

export type Locale = z.infer<typeof LocaleSchema>;
