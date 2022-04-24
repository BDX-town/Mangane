/**
 * globals: do things through the console.
 * This feature is for developers.
 */
import { changeSettingImmediate } from 'soapbox/actions/settings';

import type { Store } from 'soapbox/store';

/** Add Soapbox globals to the window. */
export const createGlobals = (store: Store) => {
  const Soapbox = {
    /** Become a developer with `Soapbox.isDeveloper()` */
    isDeveloper: (bool = true): boolean => {
      if (![true, false].includes(bool)) {
        throw `Invalid option ${bool}. Must be true or false.`;
      }
      store.dispatch(changeSettingImmediate(['isDeveloper'], bool) as any);
      return bool;
    },
  };

  (window as any).Soapbox = Soapbox;
};
