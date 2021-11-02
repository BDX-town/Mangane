/**
 * globals: do things through the console.
 * This feature is for developers.
 */
import { changeSetting } from 'soapbox/actions/settings';

export const createGlobals = store => {
  const Soapbox = {
    // Become a developer with `Soapbox.isDeveloper()`
    isDeveloper: (bool = true) => {
      if (![true, false].includes(bool)) {
        throw `Invalid option ${bool}. Must be true or false.`;
      }
      store.dispatch(changeSetting(['isDeveloper'], bool));
      return bool;
    },
  };

  window.Soapbox = Soapbox;
};
