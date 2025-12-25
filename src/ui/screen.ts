import { COLORS, HANDLERS, PATHS } from '../constants';
import { load } from '../utils/loaders';
import { Locale, LocaleSchema } from '../schemas/locale';
import { buildSelect } from './builders';

export const colorize = (text: string): string =>
  `${COLORS.red}${text}${COLORS.reset}`;

export const display = (
  end: string,
  elements: string[] = [new Date().toLocaleTimeString()],
): void => {
  console.log(
    `${elements.map((element) => `${colorize('[')}${element}${colorize(']')}`).join('')}: ${colorize(end)}`,
  );
};

export class Screen {
  private __locale: Locale;

  constructor(locale: string) {
    this.__locale = load<Locale>(
      PATHS.locales.replace('%s', locale),
      LocaleSchema,
    );
  }

  get locale(): Locale {
    return this.__locale;
  }

  set locale(locale: string) {
    this.__locale = load<Locale>(
      PATHS.locales.replace('%s', locale),
      LocaleSchema,
    );
  }

  public displayLogo = () => {
    console.clear();
    console.log(colorize(Buffer.from(this.__locale.logo, 'base64').toString()));
    console.log(this.__locale.logoCredit);
  };

  public run = async () => {
    while (true) {
      this.displayLogo();

      await HANDLERS[
        await buildSelect(
          this.__locale.enters.chooseAction,
          this.__locale.choices.main,
        )
      ].handle();
    }
  };
}
