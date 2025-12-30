import { generateToken, Rave } from 'ravejs';
import { NiceMail } from 'nicemail-ts';
import { Tor } from 'tor-control-ts';

import { Handler } from '../interfaces/handler';
import { display } from '../ui/screen';
import { pool } from '../utils/tasks';
import initCache, { cacheSet } from '../utils/cache';
import { buildInput } from '../ui/builders';
import {
  CONFIG,
  MAX_PROXIES_BATCH,
  PROXIES,
  SCREEN,
  LOCALHOST,
} from '../constants';
import {
  delay,
  getVerificationLink,
  sendDelayedVerify,
} from '../utils/helpers';

export class StartHandler implements Handler {
  private __nicemail: NiceMail = new NiceMail();
  private __proxies: string[] = [];

  private __nickname?: string;
  private __tor?: Tor;

  private __torSetup = async (): Promise<Tor | undefined> => {
    try {
      this.__tor = new Tor({
        host: LOCALHOST,
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

  private __registerSetup = async (
    rave: Rave,
    proxy: string,
  ): Promise<void> => {
    const mail = this.__nicemail.getMail();

    try {
      const { stateId } = await rave.auth.sendMagicLink(mail);
      display(SCREEN.locale.logs.mailCreated, [mail]);

      const link = await getVerificationLink(this.__nicemail, mail);

      if (!link) {
        display(SCREEN.locale.errors.accountCreationFailed, [mail]);
        return;
      }

      sendDelayedVerify(link);
      await delay(6);
      display(SCREEN.locale.logs.verifyChainPassed, [mail]);

      const state = await rave.auth.checkRegisterState(stateId);
      const credentials = await rave.auth.parseUserCredentials(
        state.oauth!.idToken,
        mail,
      );
      const deviceId = generateToken();

      rave.proxy = proxy;

      await rave.auth.mojoLogin(
        mail,
        credentials.objectId,
        credentials.sessionToken,
        this.__nickname!,
        deviceId,
      );
      cacheSet({
        email: mail,
        token: credentials.sessionToken.slice(
          2,
          credentials.sessionToken.length,
        ),
        deviceId,
      });
      display(SCREEN.locale.logs.accountCreated, [mail]);
    } catch (error) {
      display(
        `${SCREEN.locale.errors.accountCreationFailed} - ${(error as Error).message}`,
        [mail],
      );
    } finally {
      rave.offProxy();
    }
  };

  async handle(): Promise<void> {
    SCREEN.displayLogo();
    this.__nickname = await buildInput(
      SCREEN.locale.enters.enterAccountsNickname,
    );

    initCache();
    const rave = new Rave();

    if (!(await this.__torSetup())) return;
    await this.__nicemail.authorize();

    while (true) {
      await this.__proxySetup();
      SCREEN.displayLogo();
      display(
        SCREEN.locale.logs.proxiesConnected.replace(
          '%s',
          this.__proxies.length.toString(),
        ),
      );

      for (const proxy of this.__proxies) {
        await this.__registerSetup(rave, proxy);
      }
      await delay(3);
    }
  }
}
