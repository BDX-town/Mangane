import {
  INSTANCE_FETCH_SUCCESS,
  INSTANCE_FETCH_FAIL,
  NODEINFO_FETCH_SUCCESS,
} from '../actions/instance';
import { PLEROMA_PRELOAD_IMPORT } from 'soapbox/actions/preload';
import { ADMIN_CONFIG_UPDATE_REQUEST, ADMIN_CONFIG_UPDATE_SUCCESS } from 'soapbox/actions/admin';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import { ConfigDB } from 'soapbox/utils/config_db';

const nodeinfoToInstance = nodeinfo => {
  // Match Pleroma's develop branch
  return ImmutableMap({
    pleroma: ImmutableMap({
      metadata: ImmutableMap({
        account_activation_required: nodeinfo.getIn(['metadata', 'accountActivationRequired']),
        features: nodeinfo.getIn(['metadata', 'features']),
        federation: nodeinfo.getIn(['metadata', 'federation']),
        fields_limits: ImmutableMap({
          max_fields: nodeinfo.getIn(['metadata', 'fieldsLimits', 'maxFields']),
        }),
      }),
    }),
  });
};

// Set Mastodon defaults, overridden by Pleroma servers
const initialState = ImmutableMap({
  max_toot_chars: 500,
  description_limit: 1500,
  poll_limits: ImmutableMap({
    max_expiration: 2629746,
    max_option_chars: 25,
    max_options: 4,
    min_expiration: 300,
  }),
  version: '0.0.0',
});

const preloadImport = (state, action, path) => {
  const data = action.data[path];
  return data ? initialState.mergeDeep(fromJS(data)) : state;
};

const getConfigValue = (instanceConfig, key) => {
  const v = instanceConfig
    .find(value => value.getIn(['tuple', 0]) === key);

  return v ? v.getIn(['tuple', 1]) : undefined;
};

const importConfigs = (state, configs) => {
  // FIXME: This is pretty hacked together. Need to make a cleaner map.
  const config = ConfigDB.find(configs, ':pleroma', ':instance');
  const simplePolicy = ConfigDB.toSimplePolicy(configs);

  if (!config && !simplePolicy) return state;

  return state.withMutations(state => {
    if (config) {
      const value = config.get('value', ImmutableList());
      const registrationsOpen = getConfigValue(value, ':registrations_open');
      const approvalRequired = getConfigValue(value, ':account_approval_required');

      state.update('registrations', c => typeof registrationsOpen === 'boolean' ? registrationsOpen : c);
      state.update('approval_required', c => typeof approvalRequired === 'boolean' ? approvalRequired : c);
    }

    if (simplePolicy) {
      state.setIn(['pleroma', 'metadata', 'federation', 'mrf_simple'], simplePolicy);
    }
  });
};

const handleAuthFetch = state => {
  // Authenticated fetch is enabled, so make the instance appear censored
  return ImmutableMap({
    title: '██████',
    description: '████████████',
  }).merge(state);
};

export default function instance(state = initialState, action) {
  switch(action.type) {
  case PLEROMA_PRELOAD_IMPORT:
    return preloadImport(state, action, '/api/v1/instance');
  case INSTANCE_FETCH_SUCCESS:
    return initialState.mergeDeep(fromJS(action.instance));
  case INSTANCE_FETCH_FAIL:
    return action.error.response.status === 401 ? handleAuthFetch(state) : state;
  case NODEINFO_FETCH_SUCCESS:
    return nodeinfoToInstance(fromJS(action.nodeinfo)).mergeDeep(state);
  case ADMIN_CONFIG_UPDATE_REQUEST:
  case ADMIN_CONFIG_UPDATE_SUCCESS:
    return importConfigs(state, fromJS(action.configs));
  default:
    return state;
  }
}
