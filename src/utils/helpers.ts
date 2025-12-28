import { randomFillSync } from 'crypto';
import { readFileSync } from 'fs';
import { getInbox, getMessage } from './nicemail';

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

export const matchVerificationLink = (text: string): string =>
  text.match(/https?:\/\/api\.mojoauth\.com[^\s"']*/g)![0];

export const getVerificationLink = async (
  mail: string,
): Promise<string | undefined> => {
  let message: string | undefined;

  for (let i = 0; i < 10; i++) {
    const messages = await getInbox(mail);

    if (messages.length) {
      message = (await getMessage(mail, messages[0].id)).body.text;
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

export const generateRequestId = () => {
  const t = new Uint8Array(16);
  randomFillSync(t);
  return Array.from(t, (r: number) => r.toString(16).padStart(2, '0')).join('');
};

export const generateMailName = () =>
  `usermjp${(Math.random() + 1).toString(36).substring(7)}@oeralb.com`;
