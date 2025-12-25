import { SettingsHandler } from './handlers/settings-handler';
import { StartHandler } from './handlers/start-handler';
import { Handler } from './interfaces/handler';
import { Config, ConfigSchema } from './schemas/config';
import { Screen } from './ui/screen';
import { readSplitLines } from './utils/helpers';
import { makeIfIsnt } from './utils/loaders';

// Simple

export const MAX_PROXIES_BATCH = 35;
export const MAX_MAILS_BATCH = 6;

// Structures

export const PATHS = {
  config: '../config.json',
  cache: '../cache.json',
  proxies: '../proxies.json',
  locales: '../locales/%s.json',
};

const DEFAULT_CONFIG: Config = {
  locale: 'en',
  torControlPort: 9251,
  torControlPassword: '',
};

export const COLORS = {
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

export const CUSTOM_THEME = {
  prefix: {
    idle: `${COLORS.red}?${COLORS.reset}`,
    done: `${COLORS.red}✔${COLORS.reset}`,
  },
  style: {
    answer: (text: string) => COLORS.red + text + COLORS.reset,
    message: (text: string) => COLORS.reset + text,
    highlight: (text: string) => COLORS.red + text + COLORS.reset,
    description: (text: string) => COLORS.red + text + COLORS.reset,
    disabled: (text: string) => COLORS.red + text + COLORS.reset,
  },
};

// Instances

export let CONFIG = makeIfIsnt<Config>(
  PATHS.config,
  DEFAULT_CONFIG,
  ConfigSchema,
);

export const SCREEN = new Screen(CONFIG.locale);

export const HANDLERS: Record<string, Handler> = {
  start: new StartHandler(),
  settings: new SettingsHandler(),
};

// Other

export const PROXIES = readSplitLines(PATHS.proxies);
