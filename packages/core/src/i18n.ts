import * as en from './locales/en.json';
import * as nl from './locales/nl.json';
import { format } from './utils';
import { get } from 'lodash-es';

export type LanguageData = {
  [P in string]: string | LanguageData;
};

// @ts-ignore
window.data = {
  en: en as LanguageData,
  nl: nl as LanguageData,
};

declare global {
  // eslint-disable-next-line no-var
  var scratchLanguage: 'nl' | 'en';
  // eslint-disable-next-line no-var
  var i18nDisabled: boolean;
}

export function initialiseTranslations(
  language: 'nl' | 'en' = 'nl',
  translations?: LanguageData,
): void {
  window.scratchLanguage = language;
  window.i18nDisabled = false;

  if (translations) {
    // @ts-ignore
    window.data.en = { ...window.data.en, ...translations.en };
    // @ts-ignore
    window.data.nl = { ...window.data.nl, ...translations.nl };
  }
}

/**
 * Return the translation string for the given key.
 *
 * @param key The translation key. May be nested, e.g. "test.example.ok".
 * @param values Optional values to format in the message. See the format function.
 */
export function t(key: string, ...values: string[]): string {
  if (window.i18nDisabled) {
    return format(key, ...values);
  }
  const currentLang = window.scratchLanguage;
  // @ts-ignore
  const string = get(window.data[currentLang], key) as string | undefined;
  if (!string) {
    return format(key, ...values);
  }
  return format(string, ...values);
}
