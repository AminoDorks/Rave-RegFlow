import { readFileSync } from 'fs';

export const readSplitLines = (path: string): string[] => {
  const lines = readFileSync(path, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map((line) => line.replace(/\r/g, ''));

  return Array.from(new Set(lines));
};

export const delay = (seconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
