/**
 * Instance normalizer:
 * Converts API instances into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/instance/}
 */
import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import { parseVersion, PLEROMA } from 'soapbox/utils/features';
import { mergeDefined } from 'soapbox/utils/normalizers';
import { isNumber } from 'soapbox/utils/numbers';

// Use Mastodon defaults
// https://docs.joinmastodon.org/entities/instance/
export const InstanceRecord = ImmutableRecord({
  approval_required: false,
  contact_account: ImmutableMap<string, any>(),
  configuration: ImmutableMap<string, any>({
    media_attachments: ImmutableMap<string, any>(),
    polls: ImmutableMap<string, number>({
      max_options: 4,
      max_characters_per_option: 25,
      min_expiration: 300,
      max_expiration: 2629746,
    }),
    statuses: ImmutableMap<string, number>({
      max_characters: 500,
      max_media_attachments: 4,
    }),
  }),
  description: '',
  description_limit: 1500,
  email: '',
  feature_quote: false,
  fedibird_capabilities: ImmutableList(),
  invites_enabled: false,
  languages: ImmutableList(),
  pleroma: ImmutableMap<string, any>({
    metadata: ImmutableMap<string, any>({
      account_activation_required: false,
      birthday_min_age: 0,
      birthday_required: false,
      features: ImmutableList(),
      federation: ImmutableMap<string, any>({
        enabled: true,
        exclusions: false,
      }),
    }),
    stats: ImmutableMap(),
  }),
  registrations: false,
  rules: ImmutableList(),
  short_description: '',
  stats: ImmutableMap<string, number>({
    domain_count: 0,
    status_count: 0,
    user_count: 0,
  }),
  title: '',
  thumbnail: '',
  uri: '',
  urls: ImmutableMap<string, string>(),
  version: '0.0.0',
});

// Build Mastodon configuration from Pleroma instance
const pleromaToMastodonConfig = (instance: ImmutableMap<string, any>) => {
  return ImmutableMap({
    statuses: ImmutableMap({
      max_characters: instance.get('max_toot_chars'),
    }),
    polls: ImmutableMap({
      max_options: instance.getIn(['poll_limits', 'max_options']),
      max_characters_per_option: instance.getIn(['poll_limits', 'max_option_chars']),
      min_expiration: instance.getIn(['poll_limits', 'min_expiration']),
      max_expiration: instance.getIn(['poll_limits', 'max_expiration']),
    }),
  });
};

// Get the software's default attachment limit
const getAttachmentLimit = (software: string | null) => software === PLEROMA ? Infinity : 4;

// Normalize version
const normalizeVersion = (instance: ImmutableMap<string, any>) => {
  return instance.update('version', '0.0.0', version => {
    // Handle Mastodon release candidates
    if (new RegExp(/[0-9\.]+rc[0-9]+/g).test(version)) {
      return version.split('rc').join('-rc');
    } else {
      return version;
    }
  });
};

// Normalize instance (Pleroma, Mastodon, etc.) to Mastodon's format
export const normalizeInstance = (instance: Record<string, any>) => {
  return InstanceRecord(
    ImmutableMap(fromJS(instance)).withMutations((instance: ImmutableMap<string, any>) => {
      const { software } = parseVersion(instance.get('version'));
      const mastodonConfig = pleromaToMastodonConfig(instance);

      // Merge configuration
      instance.update('configuration', ImmutableMap(), configuration => (
        configuration.mergeDeepWith(mergeDefined, mastodonConfig)
      ));

      // If max attachments isn't set, check the backend software
      instance.updateIn(['configuration', 'statuses', 'max_media_attachments'], value => {
        return isNumber(value) ? value : getAttachmentLimit(software);
      });

      // Normalize version
      normalizeVersion(instance);

      // Merge defaults
      instance.mergeDeepWith(mergeDefined, InstanceRecord());
    }),
  );
};
