import { homedir } from 'os';

import { SettingsHandler } from './handlers/settings-handler';
import { StartHandler } from './handlers/start-handler';
import { Handler } from './interfaces/handler';
import { Config, ConfigSchema } from './schemas/config';
import { Screen } from './ui/screen';
import { makeIfIsnt } from './utils/loaders';

export const MAX_PROXIES_BATCH = 35;
export const LOCALHOST = '127.0.0.1';

export const TORRC_PATHS = {
  win: [
    'C:/Tor Browser/Browser/TorBrowser/Data/Tor/torrc',
    'C:/Users/user/Desktop/Tor Browser/Browser/TorBrowser/Data/Tor/torrc',
  ],
  unix: [
    '/etc/tor/torrc',
    '/usr/local/etc/tor/torrc',
    '/etc/torrc',
    `${homedir()}/.tor/torrc`,
    `${homedir()}/torrc`,
  ],
};

export const MAIL_URLS = {
  nicemail: 'https://nicemail.cc/ru',
  api: 'https://web.nicemail.cc/api/v1',
};

export const PATHS = {
  config: '../config.json',
  cache: '../cache.json',
  locales: '../locales/%s.json',
};

const DEFAULT_CONFIG: Config = {
  locale: 'en',
  torPort: 9251,
  torPassword: '',
  customPath: '',
  proxies: [],
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
