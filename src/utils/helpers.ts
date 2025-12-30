import { randomFillSync } from 'crypto';
import { readFileSync } from 'fs';
import { NiceMail } from 'nicemail-ts';

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
  nicemail: NiceMail,
  mail: string,
): Promise<string | undefined> => {
  let message: string | undefined;

  for (let i = 0; i < 10; i++) {
    const messages = await nicemail.getInbox(mail);

    if (messages.length) {
      message = (await nicemail.getMessage(mail, messages[0].id)).body.text;
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
