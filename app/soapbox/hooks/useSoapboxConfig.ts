import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { useAppSelector } from 'soapbox/hooks';

import type { Map as ImmutableMap } from 'immutable';

/** Get the Soapbox config from the store */
export const useSoapboxConfig = (): ImmutableMap<string, any> => {
  return useAppSelector((state) => getSoapboxConfig(state));
};
