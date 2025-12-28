import { APIException, generateToken, Rave } from 'ravejs';

import { Handler } from '../interfaces/handler';
import { display } from '../ui/screen';
import {
  delay,
  generateMailName,
  getVerificationLink,
  sendDelayedVerify,
} from '../utils/helpers';
import { pool } from '../utils/tasks';
import { Tor } from 'tor-control-ts';
import {
  CONFIG,
  MAX_MAILS_BATCH,
  MAX_PROXIES_BATCH,
  PROXIES,
  SCREEN,
  MAIL_ITERATIONS,
} from '../constants';
import initCache, { cacheSet } from '../utils/cache';
import { RegisterContext } from '../schemas/register-context';

export class StartHandler implements Handler {
  private __proxies: string[] = [];
  private __contexts: RegisterContext[] = [];

  private __tor?: Tor;

  private __registerTask = async (context: RegisterContext) => {
    const proxy = this.__proxies.shift();
    if (!proxy) {
      display(SCREEN.locale.logs.noProxyAvailable, [context.email]);
      return;
    }

    const credentials = await context.instance.auth.parseUserCredentials(
      context.idToken,
      context.email,
    );
    context.instance.proxy = proxy;

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
    } catch (error) {
      display(
        `${SCREEN.locale.errors.accountCreationFailed}: ${(error as unknown as APIException).message}`,
        [context.email],
      );
    }
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
          const rave = new Rave();
          const mail = generateMailName();
          const stateData = await rave.auth.sendMagicLink(mail);
          const verificationLink = await getVerificationLink(mail);

          if (!verificationLink) return;

          sendDelayedVerify(verificationLink);
          await delay(6);

          const state = await rave.auth.checkRegisterState(stateData.stateId);

          this.__contexts.push({
            email: mail,
            idToken: state.oauth!.idToken,
            deviceId: generateToken(),
            instance: rave,
          });
          display(SCREEN.locale.logs.mailCreated, [taskIter.toString(), mail]);
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
    this.__proxies = [];

    await this.__tor?.signalNewnym();
    display(SCREEN.locale.logs.newNym);

    await pool<string>(
      PROXIES,
      async (proxy: string) => {
        const rave = new Rave();
        rave.proxy = proxy;

        if (await rave.proxyIsAlive()) {
          this.__proxies.push(proxy);
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
      this.__registerTask,
      this.__contexts.length,
    );
  };

  async handle(): Promise<void> {
    SCREEN.displayLogo();
    initCache();
    if (!(await this.__torSetup())) return;

    await this.__mailSetup();

    while (true) {
      await this.__proxySetup();
      if (this.__proxies.length >= this.__contexts.length) break;
    }

    SCREEN.displayLogo();
    display(
      SCREEN.locale.logs.proxiesConnected.replace(
        '%s',
        this.__proxies.length.toString(),
      ),
    );

    await this.__registerSetup();
    this.__contexts = [];
  }
}
