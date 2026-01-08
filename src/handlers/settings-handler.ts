import { CONFIG, PATHS, SCREEN } from '../constants';
import { Handler } from '../interfaces/handler';
import { buildSelect } from '../ui/builders';
import { setTorPassword } from '../utils/helpers';
import { save } from '../utils/loaders';

export class SettingsHandler implements Handler {
  private __languageCallback = async () => {
    const language = await buildSelect(
      SCREEN.locale.enters.chooseLanguage,
      SCREEN.locale.choices.languages,
    );

    CONFIG.locale = language;
    SCREEN.locale = language;
    save(PATHS.config, CONFIG);
  };

  private __torCallback = async () => {
    await setTorPassword();
  };

  async handle(): Promise<void> {
    const choice = await buildSelect(
      SCREEN.locale.enters.chooseAction,
      SCREEN.locale.choices.settings,
    );

    switch (choice) {
      case 'language':
        await this.__languageCallback();
        break;
      case 'tor':
        await this.__torCallback();
        break;
      default:
        break;
    }
  }
}
