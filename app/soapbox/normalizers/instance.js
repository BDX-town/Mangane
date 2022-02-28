import { Map as ImmutableMap } from 'immutable';

import { parseVersion, PLEROMA } from 'soapbox/utils/features';
import { mergeDefined } from 'soapbox/utils/normalizers';
import { isNumber } from 'soapbox/utils/numbers';

// Use Mastodon defaults
const baseInstance = ImmutableMap({
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
const getAttachmentLimit = software => software === PLEROMA ? Infinity : 4;

// Normalize instance (Pleroma, Mastodon, etc.) to Mastodon's format
export const normalizeInstance = instance => {
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
    instance.mergeDeepWith(mergeDefined, baseInstance);
    instance.deleteAll(['max_toot_chars', 'poll_limits']);
  });
};
