import { SCREEN } from './constants';
import { setMailToken } from './utils/nicemail';

(async () => {
  await setMailToken();
  await SCREEN.run();
})();
