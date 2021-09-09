import { fetchConfig, updateConfig } from './admin';
import { Set as ImmutableSet } from 'immutable';
import ConfigDB from 'soapbox/utils/config_db';

const simplePolicyMerge = (simplePolicy, host, restrictions) => {
  return simplePolicy.map((hosts, key) => {
    const isRestricted = restrictions.get(key);

    if (isRestricted) {
      return ImmutableSet(hosts).add(host);
    } else {
      return ImmutableSet(hosts).delete(host);
    }
  });
};

export function updateMrf(host, restrictions) {
  return (dispatch, getState) => {
    return dispatch(fetchConfig())
      .then(() => {
        const configs = getState().getIn(['admin', 'configs']);
        const simplePolicy = ConfigDB.toSimplePolicy(configs);
        const merged = simplePolicyMerge(simplePolicy, host, restrictions);
        const config = ConfigDB.fromSimplePolicy(merged);
        dispatch(updateConfig(config));
      });
  };
}
