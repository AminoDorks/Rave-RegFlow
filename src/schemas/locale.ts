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
    enterAccountsNickname: z.string(),
    enterTorPath: z.string(),
    chooseAccountsLanguage: z.string(),
  }),
  logs: z.object({
    cacheUpdated: z.string(),
    torConnected: z.string(),
    mailCreated: z.string(),
    newNym: z.string(),
    proxyConnected: z.string(),
    proxiesConnected: z.string(),
    verifyChainPassed: z.string(),
    accountCreated: z.string(),
    taskRestarted: z.string(),
    noProxyAvailable: z.string(),
    torConfigured: z.string(),
  }),
  errors: z.object({
    torConnectionFailed: z.string(),
    mailCreationFailed: z.string(),
    proxyConnectionFailed: z.string(),
    accountCreationFailed: z.string(),
    couldntFindTorrc: z.string(),
  }),
  choices: z.object({
    main: z.array(ChoiceSchema),
    settings: z.array(ChoiceSchema),
    languages: z.array(ChoiceSchema),
    locales: z.array(ChoiceSchema),
  }),
});

export type Locale = z.infer<typeof LocaleSchema>;
