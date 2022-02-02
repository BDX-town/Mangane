import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import { ADMIN_CONFIG_UPDATE_REQUEST, ADMIN_CONFIG_UPDATE_SUCCESS } from 'soapbox/actions/admin';
import { PLEROMA_PRELOAD_IMPORT } from 'soapbox/actions/preload';
import KVStore from 'soapbox/storage/kv_store';
import { ConfigDB } from 'soapbox/utils/config_db';
import { parseVersion, PLEROMA } from 'soapbox/utils/features';
import { isNumber } from 'soapbox/utils/numbers';

import {
  INSTANCE_REMEMBER_SUCCESS,
  INSTANCE_FETCH_SUCCESS,
  INSTANCE_FETCH_FAIL,
  NODEINFO_FETCH_SUCCESS,
} from '../actions/instance';

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

// Use Mastodon defaults
const initialState = ImmutableMap({
  description_limit: 1500,
  configuration: ImmutableMap({
    statuses: ImmutableMap({
      max_characters: 500,
      max_media_attachments: 4,
    }),
    polls: ImmutableMap({
      max_options: 4,
      max_characters_per_option: 25,
      min_expiration: 300,
      max_expiration: 2629746,
    }),
  }),
  version: '0.0.0',
});

// Build Mastodon configuration from Pleroma instance
const pleromaToMastodonConfig = instance => {
  return {
    statuses: ImmutableMap({
      max_characters: instance.get('max_toot_chars'),
    }),
    polls: ImmutableMap({
      max_options: instance.getIn(['poll_limits', 'max_options']),
      max_characters_per_option: instance.getIn(['poll_limits', 'max_option_chars']),
      min_expiration: instance.getIn(['poll_limits', 'min_expiration']),
      max_expiration: instance.getIn(['poll_limits', 'max_expiration']),
    }),
  };
};

// Use new value only if old value is undefined
const mergeDefined = (oldVal, newVal) => oldVal === undefined ? newVal : oldVal;

// Get the software's default attachment limit
const getAttachmentLimit = software => software === PLEROMA ? Infinity : 4;

// Normalize instance (Pleroma, Mastodon, etc.) to Mastodon's format
const normalizeInstance = instance => {
  const { software } = parseVersion(instance.get('version'));
  const mastodonConfig = pleromaToMastodonConfig(instance);

  return instance.withMutations(instance => {
    // Merge configuration
    instance.update('configuration', ImmutableMap(), configuration => (
      configuration.mergeDeepWith(mergeDefined, mastodonConfig)
    ));

    // If max attachments isn't set, check the backend software
    instance.updateIn(['configuration', 'statuses', 'max_media_attachments'], value => {
      return isNumber(value) ? value : getAttachmentLimit(software);
    });

    // Merge defaults & cleanup
    instance.mergeDeepWith(mergeDefined, initialState);
    instance.deleteAll(['max_toot_chars', 'poll_limits']);
  });
};

const importInstance = (state, instance) => {
  return normalizeInstance(instance);
};

const importNodeinfo = (state, nodeinfo) => {
  return nodeinfoToInstance(nodeinfo).mergeDeep(state);
};

const preloadImport = (state, action, path) => {
  const instance = action.data[path];
  return instance ? importInstance(state, fromJS(instance)) : state;
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

const getHost = instance => {
  try {
    return new URL(instance.uri).host;
  } catch {
    try {
      return new URL(`https://${instance.uri}`).host;
    } catch {
      return null;
    }
  }
};

const persistInstance = instance => {
  const host = getHost(instance);

  if (host) {
    KVStore.setItem(`instance:${host}`, instance).catch(console.error);
  }
};

const handleInstanceFetchFail = (state, error) => {
  if (error.response && error.response.status === 401) {
    return handleAuthFetch(state);
  } else {
    return state;
  }
};

export default function instance(state = initialState, action) {
  switch(action.type) {
  case PLEROMA_PRELOAD_IMPORT:
    return preloadImport(state, action, '/api/v1/instance');
  case INSTANCE_REMEMBER_SUCCESS:
    return importInstance(state, fromJS(action.instance));
  case INSTANCE_FETCH_SUCCESS:
    persistInstance(action.instance);
    return importInstance(state, fromJS(action.instance));
  case INSTANCE_FETCH_FAIL:
    return handleInstanceFetchFail(state, action.error);
  case NODEINFO_FETCH_SUCCESS:
    return importNodeinfo(state, fromJS(action.nodeinfo));
  case ADMIN_CONFIG_UPDATE_REQUEST:
  case ADMIN_CONFIG_UPDATE_SUCCESS:
    return importConfigs(state, fromJS(action.configs));
  default:
    return state;
  }
}
