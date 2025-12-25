import { Rave } from 'ravejs';
import { Handler } from '../interfaces/handler';
import { TorProxy } from '../schemas/proxy';
import { display } from '../ui/screen';
import { delay } from '../utils/helpers';
import { Tor } from 'tor-control-ts';
import { CONFIG, SCREEN } from '../constants';
import initCache from '../utils/cache';

export class StartHandler implements Handler {
  private __proxies: TorProxy[] = [];
  private __instances: Rave[] = [];
  private __createdAccounts: number = 0;

  private __tor?: Tor;

  private __clear = (): void => {
    this.__proxies = [];
    this.__instances = [];
    this.__createdAccounts = 0;
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

  private __mailSetup = async (): Promise<void> => {};

  private __proxySetup = async (): Promise<void> => {
    this.__clear();

    await this.__tor?.signalNewnym();
    display(SCREEN.locale.logs.newNym);
  };

  async handle(): Promise<void> {
    SCREEN.displayLogo();
    initCache();
    if (!(await this.__torSetup())) return;

    await this.__mailSetup();
    await this.__proxySetup();
  }
}
