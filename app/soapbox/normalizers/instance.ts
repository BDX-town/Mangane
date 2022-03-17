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
  contact_account: ImmutableMap(),
  configuration: ImmutableMap({
    media_attachments: ImmutableMap(),
    polls: ImmutableMap({
      max_options: 4,
      max_characters_per_option: 25,
      min_expiration: 300,
      max_expiration: 2629746,
    }),
    statuses: ImmutableMap({
      max_characters: 500,
      max_media_attachments: 4,
    }),
  }),
  description: '',
  description_limit: 1500,
  email: '',
  fedibird_capabilities: ImmutableList(),
  invites_enabled: false,
  languages: ImmutableList(),
  pleroma: ImmutableMap({
    metadata: ImmutableMap({
      account_activation_required: false,
      birthday_min_age: 0,
      birthday_required: false,
      features: ImmutableList(),
      federation: ImmutableMap({
        enabled: true,
        exclusions: false,
      }),
    }),
    stats: ImmutableMap(),
  }),
  registrations: false,
  rules: ImmutableList(),
  short_description: '',
  stats: ImmutableMap({
    domain_count: 0,
    status_count: 0,
    user_count: 0,
  }),
  title: '',
  thumbnail: '',
  uri: '',
  urls: ImmutableMap(),
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
const getAttachmentLimit = (software: string) => software === PLEROMA ? Infinity : 4;

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

      // Merge defaults
      instance.mergeDeepWith(mergeDefined, InstanceRecord());
    }),
  );
};
