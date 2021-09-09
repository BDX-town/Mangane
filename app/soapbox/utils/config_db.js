import {
  Map as ImmutableMap,
  List as ImmutableList,
  Set as ImmutableSet,
  fromJS,
} from 'immutable';
import { trimStart } from 'lodash';

const find = (configs, group, key) => {
  return configs.find(config =>
    config.isSuperset({ group, key }),
  );
};

const toSimplePolicy = configs => {
  const config = find(configs, ':pleroma', ':mrf_simple');

  const reducer = (acc, curr) => {
    const { tuple: [key, hosts] } = curr.toJS();
    return acc.set(trimStart(key, ':'), ImmutableSet(hosts));
  };

  if (config && config.get) {
    const value = config.get('value', ImmutableList());
    return value.reduce(reducer, ImmutableMap());
  } else {
    return ImmutableMap();
  }
};

const fromSimplePolicy = simplePolicy => {
  const mapper = (hosts, key) => fromJS({ tuple: [`:${key}`, hosts.toJS()] });
  const value = simplePolicy.map(mapper).toList();

  return ImmutableList([
    ImmutableMap({
      group: ':pleroma',
      key: ':mrf_simple',
      value,
    }),
  ]);
};

export const ConfigDB = {
  find,
  toSimplePolicy,
  fromSimplePolicy,
};

export default ConfigDB;
