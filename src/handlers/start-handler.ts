import Mailjs from '@cemalgnlts/mailjs';
import { generateToken, Rave } from 'ravejs';

import { Handler } from '../interfaces/handler';
import { TorProxy } from '../schemas/proxy';
import { display } from '../ui/screen';
import {
  delay,
  getVerificationLink,
  sendDelayedVerify,
} from '../utils/helpers';
import { pool } from '../utils/tasks';
import { Tor } from 'tor-control-ts';
import {
  MAIL_ITERATIONS,
  CONFIG,
  MAX_MAILS_BATCH,
  MAX_PROXIES_BATCH,
  PROXIES,
  SCREEN,
  MAX_REGISTER_BATCH,
  RATE_LIMIT_PER_IP,
} from '../constants';
import initCache, { cacheSet } from '../utils/cache';
import { RegisterContext } from '../schemas/register-context';

export class StartHandler implements Handler {
  private __proxies: TorProxy[] = [];
  private __contexts: RegisterContext[] = [];
  private __createdAccounts: number = 0;

  private __tor?: Tor;

  private __clear = (): void => {
    this.__proxies = [];
    this.__createdAccounts = 0;
  };

  private __getProxySafe = async (): Promise<TorProxy | undefined> => {
    const proxy =
      this.__proxies[Math.floor(Math.random() * this.__proxies.length)];
    if (!proxy) return;

    if (proxy.timesUsed >= RATE_LIMIT_PER_IP) {
      this.__proxies.splice(this.__proxies.indexOf(proxy), 1);
      return;
    }

    proxy.timesUsed++;
    return proxy;
  };

  private __torSetup = async (): Promise<Tor | undefined> => {
    try {
      this.__tor = new Tor({
        host: '127.0.0.1',
        port: CONFIG.torControlPort,
        password: CONFIG.torControlPassword,
      });
      await this.__tor.connect();
      display(SCREEN.locale.logs.torConnected);

      return this.__tor;
    } catch {
      display(SCREEN.locale.errors.torConnectionFailed);
      await delay(1);
      return;
    }
  };

  private __mailSetup = async (): Promise<void> => {
    await pool<number>(
      Array.from({ length: MAIL_ITERATIONS }, (_, index) => index + 1),
      async (taskIter: number) => {
        try {
          const mail = new Mailjs();
          const rave = new Rave();

          const account = await mail.createOneAccount();
          const stateData = await rave.auth.sendMagicLink(
            account.data.username,
          );
          const verificationLink = await getVerificationLink(mail);

          if (!verificationLink) return;

          sendDelayedVerify(verificationLink);
          await delay(6);

          const state = await rave.auth.checkRegisterState(stateData.stateId);

          this.__contexts.push({
            email: account.data.username,
            idToken: state.oauth!.idToken,
            deviceId: generateToken(),
            instance: rave,
          });
          display(SCREEN.locale.logs.mailCreated, [account.data.username]);
        } catch {
          display(SCREEN.locale.errors.mailCreationFailed, [
            taskIter.toString(),
          ]);
        }
      },
      MAX_MAILS_BATCH,
    );
  };

  private __proxySetup = async (): Promise<void> => {
    this.__clear();

    await this.__tor?.signalNewnym();
    display(SCREEN.locale.logs.newNym);

    await pool<string>(
      PROXIES,
      async (proxy: string) => {
        const rave = new Rave();
        rave.proxy = proxy;

        if (await rave.proxyIsAlive()) {
          this.__proxies.push({ proxy, timesUsed: 0 });
          rave.offProxy();
          display(SCREEN.locale.logs.proxyConnected, [proxy]);

          return;
        }

        display(SCREEN.locale.errors.proxyConnectionFailed, [proxy]);
      },
      MAX_PROXIES_BATCH,
    );
  };

  private __registerSetup = async (): Promise<void> => {
    await pool<RegisterContext>(
      this.__contexts,
      async (context: RegisterContext) => {
        const torProxy = await this.__getProxySafe();
        if (!torProxy) return;

        const credentials = await context.instance.auth.parseUserCredentials(
          context.idToken,
          context.email,
        );
        context.instance.proxy = torProxy.proxy;

        try {
          await context.instance.auth.mojoLogin(
            context.email,
            credentials.objectId,
            credentials.sessionToken,
            'sdfldslfdf',
            context.deviceId,
          );
          cacheSet({
            email: context.email,
            token: credentials.sessionToken.slice(
              2,
              credentials.sessionToken.length,
            ),
            deviceId: context.deviceId,
          });
          display(SCREEN.locale.logs.accountCreated, [context.email]);
        } catch {
          this.__proxies.splice(this.__proxies.indexOf(torProxy), 1);
          display(SCREEN.locale.errors.accountCreationFailed, [context.email]);
        }
      },
      MAX_REGISTER_BATCH,
    );
  };

  async handle(): Promise<void> {
    SCREEN.displayLogo();
    initCache();
    if (!(await this.__torSetup())) return;

    await this.__mailSetup();
    await this.__proxySetup();

    SCREEN.displayLogo();
    display(
      SCREEN.locale.logs.proxiesConnected.replace(
        '%s',
        this.__proxies.length.toString(),
      ),
    );

    await this.__registerSetup();
  }
}
