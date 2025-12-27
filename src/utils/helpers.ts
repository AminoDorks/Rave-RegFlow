import Mailjs from '@cemalgnlts/mailjs';
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

export const matchVerificationLink = (text: string): string => {
  const rawUrl = text.match(/https?:\/\/api\.mojoauth\.com[^\s"']*/g)![0];

  return rawUrl.slice(0, rawUrl.length - 1);
};

export const getVerificationLink = async (
  mail: Mailjs,
): Promise<string | undefined> => {
  let message: string | undefined;

  for (let i = 0; i < 10; i++) {
    const messages = await mail.getMessages();

    if (messages.data.length) {
      message = (await mail.getMessage(messages.data[0].id)).data.text;
      break;
    }
    await delay(1);
  }

  if (!message) return;

  return matchVerificationLink(message);
};

export const sendDelayedVerify = async (link: string) => {
  try {
    await fetch(link, { method: 'GET' });
  } catch {}
};
