import { useAppSelector } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';

import type { Features } from 'soapbox/utils/features';

/** Get features for the current instance */
export const useFeatures = (): Features => {
  return useAppSelector((state) => getFeatures(state.instance));
};
