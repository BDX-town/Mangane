import { getSettings } from 'soapbox/actions/settings';
import { useAppSelector } from 'soapbox/hooks';

import type { Map as ImmutableMap } from 'immutable';

/** Get the user settings from the store */
export const useSettings = (): ImmutableMap<string, any> => {
  return useAppSelector((state) => getSettings(state));
};
