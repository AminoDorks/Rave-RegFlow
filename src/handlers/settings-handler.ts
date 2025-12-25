import { CONFIG, PATHS, SCREEN } from '../constants';
import { Handler } from '../interfaces/handler';
import { buildInput, buildSelect, numericFilter } from '../ui/builders';
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
    const torPort = await buildInput(SCREEN.locale.enters.enterTorPort, {
      defaultAnswer: CONFIG.torControlPort.toString(),
      filter: numericFilter,
    });
    const torPassword = await buildInput(
      SCREEN.locale.enters.enterTorPassword,
      { defaultAnswer: CONFIG.torControlPassword },
    );

    CONFIG.torControlPort = Number(torPort);
    CONFIG.torControlPassword = torPassword;
    save(PATHS.config, CONFIG);
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
