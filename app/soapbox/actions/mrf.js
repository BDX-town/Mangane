import { fetchInstance } from './instance';
import { updateConfig } from './admin';
import { Set as ImmutableSet } from 'immutable';

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

const simplePolicyToConfig = simplePolicy => {
  const value = simplePolicy.map((hosts, key) => (
    { tuple: [`:${key}`, hosts.toJS()] }
  )).toList();

  return [{
    group: ':pleroma',
    key: ':mrf_simple',
    value,
  }];
};

export function updateMrf(host, restrictions) {
  return (dispatch, getState) => {
    return dispatch(fetchInstance())
      .then(() => {
        const simplePolicy = getState().getIn(['instance', 'pleroma', 'metadata', 'federation', 'mrf_simple']);
        const merged = simplePolicyMerge(simplePolicy, host, restrictions);
        const config = simplePolicyToConfig(merged);
        dispatch(updateConfig(config));

        // TODO: Make this less insane
        setTimeout(() => {
          dispatch(fetchInstance());
        }, 1000);
      });
  };
}
