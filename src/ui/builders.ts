import { existsSync } from 'fs';

import { CUSTOM_THEME } from '../constants';
import { Choice, InputCustomConfig } from '../schemas/inquirer';

// @ts-ignore: TS1542 — type import of ESM from CJS not allowed; using dynamic import at runtime
let _prompts: typeof import('@inquirer/prompts'); // fuck commonjs

export const numericFilter = (value: string) => !isNaN(parseInt(value));
export const fileFilter = (value: string) => existsSync(value);

const getPrompts = async () => {
  if (!_prompts) _prompts = await import('@inquirer/prompts');

  return _prompts;
};

export const buildInput = async (
  content: string,
  config: InputCustomConfig = { filter: () => true, required: true },
): Promise<string> => {
  return await (
    await getPrompts()
  ).input({
    message: content,
    default: config.defaultAnswer,
    validate: config.filter,
    theme: CUSTOM_THEME,
  });
};

export const buildSelect = async (
  content: string,
  choices: Choice[],
  pageSize: number = 40,
): Promise<string> => {
  return await (
    await getPrompts()
  ).select({
    message: content,
    pageSize: pageSize,
    choices: choices,
    theme: CUSTOM_THEME,
  });
};
