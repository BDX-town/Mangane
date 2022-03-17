/**
 * Mention normalizer:
 * Converts API mentions into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/mention/}
 */
import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
} from 'immutable';

import { normalizeAccount } from 'soapbox/normalizers/account';

// https://docs.joinmastodon.org/entities/mention/
export const MentionRecord = ImmutableRecord({
  id: '',
  acct: '',
  username: '',
  url: '',
});

export const normalizeMention = (mention: ImmutableMap<string, any>) => {
  // Simply normalize it as an account then cast it as a mention ¯\_(ツ)_/¯
  return MentionRecord(normalizeAccount(mention));
};
