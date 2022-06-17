import {
  Map as ImmutableMap,
  List as ImmutableList,
  Set as ImmutableSet,
  fromJS,
} from 'immutable';
import trimStart from 'lodash/trimStart';

export type Config = ImmutableMap<string, any>;
export type Policy = ImmutableMap<string, any>;

const find = (
  configs: ImmutableList<Config>,
  group: string,
  key: string,
): Config | undefined => {
  return configs.find(config =>
    config.isSuperset(ImmutableMap({ group, key })),
  );
};

const toSimplePolicy = (configs: ImmutableList<Config>): Policy => {
  const config = find(configs, ':pleroma', ':mrf_simple');

  const reducer = (acc: ImmutableMap<string, any>, curr: ImmutableMap<string, any>) => {
    const key = curr.getIn(['tuple', 0]) as string;
    const hosts = curr.getIn(['tuple', 1]) as ImmutableList<string>;
    return acc.set(trimStart(key, ':'), ImmutableSet(hosts));
  };

  if (config?.get) {
    const value = config.get('value', ImmutableList());
    return value.reduce(reducer, ImmutableMap());
  } else {
    return ImmutableMap();
  }
};

const fromSimplePolicy = (simplePolicy: Policy): ImmutableList<Config> => {
  const mapper = (hosts: ImmutableList<string>, key: string) => fromJS({ tuple: [`:${key}`, hosts.toJS()] });

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
