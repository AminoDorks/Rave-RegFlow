import z from 'zod';
import { writeFileSync, readFileSync } from 'fs';

export const load = <T>(path: string, schema: z.ZodSchema): T => {
  return schema.parse(JSON.parse(readFileSync(path, 'utf8'))) as T;
};

export const save = <T>(path: string, data: T): void => {
  writeFileSync(path, JSON.stringify(data, null, 2));
};

export const makeIfIsnt = <T>(
  path: string,
  data: T,
  schema: z.ZodSchema,
): T => {
  try {
    const content = load<T>(path, schema);
    return content;
  } catch {
    save(path, data);
    return data;
  }
};
