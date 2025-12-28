import { request } from 'undici';
import { MAIL_URLS } from '../constants';
import { generateRequestId } from './helpers';

let token: string | undefined;

const buildHeaders = () => {
  return {
    Authorization: `Bearer ${token}`,
    'x-request-id': generateRequestId(),
    'x-timestamp': Math.floor(new Date().getTime() / 1000).toString(),
  };
};

export const setMailToken = async () => {
  const { body } = await request(MAIL_URLS.nicemail, { method: 'GET' });
  token = (await body.text()).match(
    /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
  )?.[0];
};

export const getInbox = async (mail: string) => {
  const { body } = await request(`${MAIL_URLS.api}/mailbox/${mail}`, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return (await body.json()) as { id: string }[];
};

export const getMessage = async (mail: string, id: string) => {
  const { body } = await request(`${MAIL_URLS.api}/mailbox/${mail}/${id}`, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return (await body.json()) as { id: string; body: { text: string } };
};
