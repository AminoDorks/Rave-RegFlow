import { Handler } from '../interfaces/handler';
import { display } from '../ui/screen';
import { delay } from '../utils/helpers';

export class StartHandler implements Handler {
  async handle(): Promise<void> {
    display('W.I.P');
    await delay(1);
  }
}
