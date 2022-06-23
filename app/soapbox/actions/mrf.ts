import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import ConfigDB from 'soapbox/utils/config_db';

import { fetchConfig, updateConfig } from './admin';

import type { AppDispatch, RootState } from 'soapbox/store';
import type { Policy } from 'soapbox/utils/config_db';

const simplePolicyMerge = (simplePolicy: Policy, host: string, restrictions: ImmutableMap<string, any>) => {
  return simplePolicy.map((hosts, key) => {
    const isRestricted = restrictions.get(key);

    if (isRestricted) {
      return ImmutableSet(hosts).add(host);
    } else {
      return ImmutableSet(hosts).delete(host);
    }
  });
};

const updateMrf = (host: string, restrictions: ImmutableMap<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    dispatch(fetchConfig())
      .then(() => {
        const configs = getState().admin.get('configs');
        const simplePolicy = ConfigDB.toSimplePolicy(configs);
        const merged = simplePolicyMerge(simplePolicy, host, restrictions);
        const config = ConfigDB.fromSimplePolicy(merged);
        return dispatch(updateConfig(config.toJS() as Array<Record<string, any>>));
      });

export { updateMrf };
