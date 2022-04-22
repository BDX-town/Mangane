/**
 * Account normalizer:
 * Converts API accounts into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/account/}
 */
import escapeTextContentForBrowser from 'escape-html';
import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import emojify from 'soapbox/features/emoji/emoji';
import { normalizeEmoji } from 'soapbox/normalizers/emoji';
import { acctFull } from 'soapbox/utils/accounts';
import { unescapeHTML } from 'soapbox/utils/html';
import { mergeDefined, makeEmojiMap } from 'soapbox/utils/normalizers';

// https://docs.joinmastodon.org/entities/account/
export const AccountRecord = ImmutableRecord({
  acct: '',
  avatar: '',
  avatar_static: '',
  birthday: undefined,
  bot: false,
  created_at: new Date(),
  display_name: '',
  emojis: ImmutableList(),
  fields: ImmutableList(),
  followers_count: 0,
  following_count: 0,
  fqn: '',
  header: '',
  header_static: '',
  id: '',
  last_status_at: new Date(),
  location: '',
  locked: false,
  moved: null,
  note: '',
  pleroma: ImmutableMap(),
  source: ImmutableMap(),
  statuses_count: 0,
  uri: '',
  url: '',
  username: '',
  website: '',
  verified: false,

  // Internal fields
  display_name_html: '',
  note_emojified: '',
  note_plain: '',
  patron: ImmutableMap(),
  relationship: ImmutableList(),
  should_refetch: false,
});

// https://docs.joinmastodon.org/entities/field/
export const FieldRecord = ImmutableRecord({
  name: '',
  value: '',
  verified_at: null,

  // Internal fields
  name_emojified: '',
  value_emojified: '',
  value_plain: '',
});

// https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/549
const normalizePleromaLegacyFields = (account: ImmutableMap<string, any>) => {
  return account.update('pleroma', ImmutableMap(), (pleroma: ImmutableMap<string, any>) => {
    return pleroma.withMutations(pleroma => {
      const legacy = ImmutableMap({
        is_active: !pleroma.get('deactivated'),
        is_confirmed: !pleroma.get('confirmation_pending'),
        is_approved: !pleroma.get('approval_pending'),
      });

      pleroma.mergeWith(mergeDefined, legacy);
      pleroma.deleteAll(['deactivated', 'confirmation_pending', 'approval_pending']);
    });
  });
};

// Add avatar, if missing
const normalizeAvatar = (account: ImmutableMap<string, any>) => {
  const avatar = account.get('avatar');
  const avatarStatic = account.get('avatar_static');
  const missing = require('images/avatar-missing.png');

  return account.withMutations(account => {
    account.set('avatar', avatar || avatarStatic || missing);
    account.set('avatar_static', avatarStatic || avatar || missing);
  });
};

// Add header, if missing
const normalizeHeader = (account: ImmutableMap<string, any>) => {
  const header = account.get('header');
  const headerStatic = account.get('header_static');
  const missing = require('images/header-missing.png');

  return account.withMutations(account => {
    account.set('header', header || headerStatic || missing);
    account.set('header_static', headerStatic || header || missing);
  });
};

// Normalize custom fields
const normalizeFields = (account: ImmutableMap<string, any>) => {
  return account.update('fields', ImmutableList(), fields => fields.map(FieldRecord));
};

// Normalize emojis
const normalizeEmojis = (entity: ImmutableMap<string, any>) => {
  const emojis = entity.get('emojis', ImmutableList()).map(normalizeEmoji);
  return entity.set('emojis', emojis);
};

// Normalize Pleroma/Fedibird birthday
const normalizeBirthday = (account: ImmutableMap<string, any>) => {
  const birthday = [
    account.getIn(['pleroma', 'birthday']),
    account.getIn(['other_settings', 'birthday']),
  ].find(Boolean);

  return account.set('birthday', birthday);
};

// Get Pleroma tags
const getTags = (account: ImmutableMap<string, any>): ImmutableList<any> => {
  const tags = account.getIn(['pleroma', 'tags']);
  return ImmutableList(ImmutableList.isList(tags) ? tags : []);
};

// Normalize Truth Social/Pleroma verified
const normalizeVerified = (account: ImmutableMap<string, any>) => {
  return account.update('verified', verified => {
    return [
      verified === true,
      getTags(account).includes('verified'),
    ].some(Boolean);
  });
};

// Normalize Fedibird/Truth Social/Pleroma location
const normalizeLocation = (account: ImmutableMap<string, any>) => {
  return account.update('location', location => {
    return [
      location,
      account.getIn(['pleroma', 'location']),
      account.getIn(['other_settings', 'location']),
    ].find(Boolean);
  });
};

// Set username from acct, if applicable
const fixUsername = (account: ImmutableMap<string, any>) => {
  const acct = account.get('acct') || '';
  const username = account.get('username') || '';
  return account.set('username', username || acct.split('@')[0]);
};

// Set display name from username, if applicable
const fixDisplayName = (account: ImmutableMap<string, any>) => {
  const displayName = account.get('display_name') || '';
  return account.set('display_name', displayName.trim().length === 0 ? account.get('username') : displayName);
};

// Emojification, etc
const addInternalFields = (account: ImmutableMap<string, any>) => {
  const emojiMap = makeEmojiMap(account.get('emojis'));

  return account.withMutations((account: ImmutableMap<string, any>) => {
    // Emojify account properties
    account.merge({
      display_name_html: emojify(escapeTextContentForBrowser(account.get('display_name')), emojiMap),
      note_emojified: emojify(account.get('note', ''), emojiMap),
      note_plain: unescapeHTML(account.get('note', '')),
    });

    // Emojify fields
    account.update('fields', ImmutableList(), fields => {
      return fields.map((field: ImmutableMap<string, any>) => {
        return field.merge({
          name_emojified: emojify(escapeTextContentForBrowser(field.get('name')), emojiMap),
          value_emojified: emojify(field.get('value'), emojiMap),
          value_plain: unescapeHTML(field.get('value')),
        });
      });
    });
  });
};

const normalizeFqn = (account: ImmutableMap<string, any>) => {
  return account.set('fqn', acctFull(account));
};

export const normalizeAccount = (account: Record<string, any>) => {
  return AccountRecord(
    ImmutableMap(fromJS(account)).withMutations(account => {
      normalizePleromaLegacyFields(account);
      normalizeEmojis(account);
      normalizeAvatar(account);
      normalizeHeader(account);
      normalizeFields(account);
      normalizeVerified(account);
      normalizeBirthday(account);
      normalizeLocation(account);
      normalizeFqn(account);
      fixUsername(account);
      fixDisplayName(account);
      addInternalFields(account);
    }),
  );
};
