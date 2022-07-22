import MESSAGES from 'soapbox/locales/messages';

import { useSettings } from './useSettings';

/** Ensure the given locale exists in our codebase */
const validLocale = (locale: string): boolean => Object.keys(MESSAGES).includes(locale);

/** Get valid locale from settings. */
const useLocale = (fallback = 'en') => {
  const settings = useSettings();
  const locale = settings.get('locale');

  return validLocale(locale) ? locale : fallback;
};

export { useLocale };
