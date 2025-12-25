import debounce from 'lodash.debounce';
import { existsSync, readFileSync, writeFileSync } from 'fs';

import { PATHS, SCREEN } from '../constants';
import { Cache, CachedAccount } from '../schemas/cache';
import { display } from '../ui/screen';

const FAST_CACHE: CachedAccount[] = [];

const cacheSave = () => {
  writeFileSync(
    PATHS.cache,
    JSON.stringify(
      {
        accounts: [...new Set(FAST_CACHE)],
      },
      null,
      4,
    ),
  );
};

const debouncedCacheSave = debounce(() => cacheSave(), 1000);

const loadFromFile = (): Cache => {
  return JSON.parse(readFileSync(PATHS.cache, 'utf-8'));
};

export const cacheSet = (value: CachedAccount) => {
  FAST_CACHE.push(value);
  debouncedCacheSave();
};

export const initCache = () => {
  if (existsSync(PATHS.cache) && !FAST_CACHE.length) {
    FAST_CACHE.push(...new Set(loadFromFile().accounts));
  }
  debouncedCacheSave();
  display(
    SCREEN.locale.logs.cacheUpdated.replace('%s', FAST_CACHE.length.toString()),
  );
};

export default initCache;
