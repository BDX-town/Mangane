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
import { unescapeHTML } from 'soapbox/utils/html';
import { mergeDefined, makeEmojiMap } from 'soapbox/utils/normalizers';

import type { PatronAccount } from 'soapbox/reducers/patron';
import type { Emoji, Field, EmbeddedEntity } from 'soapbox/types/entities';

// https://docs.joinmastodon.org/entities/account/
export const AccountRecord = ImmutableRecord({
  acct: '',
  avatar: '',
  avatar_static: '',
  birthday: undefined as string | undefined,
  bot: false,
  created_at: new Date(),
  discoverable: false,
  display_name: '',
  emojis: ImmutableList<Emoji>(),
  favicon: '',
  fields: ImmutableList<Field>(),
  followers_count: 0,
  following_count: 0,
  fqn: '',
  header: '',
  header_static: '',
  id: '',
  last_status_at: new Date(),
  location: '',
  locked: false,
  moved: null as EmbeddedEntity<any>,
  note: '',
  pleroma: ImmutableMap<string, any>(),
  source: ImmutableMap<string, any>(),
  statuses_count: 0,
  uri: '',
  url: '',
  username: '',
  website: '',
  verified: false,

  // Internal fields
  admin: false,
  display_name_html: '',
  domain: '',
  donor: false,
  moderator: false,
  note_emojified: '',
  note_plain: '',
  patron: null as PatronAccount | null,
  relationship: ImmutableMap<string, any>(),
  should_refetch: false,
  staff: false,
});

// https://docs.joinmastodon.org/entities/field/
export const FieldRecord = ImmutableRecord({
  name: '',
  value: '',
  verified_at: null as Date | null,

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

/** Add avatar, if missing */
const normalizeAvatar = (account: ImmutableMap<string, any>) => {
  const avatar = account.get('avatar');
  const avatarStatic = account.get('avatar_static');
  const missing = require('images/avatar-missing.png');

  return account.withMutations(account => {
    account.set('avatar', avatar || avatarStatic || missing);
    account.set('avatar_static', avatarStatic || avatar || missing);
  });
};

/** Add header, if missing */
const normalizeHeader = (account: ImmutableMap<string, any>) => {
  const header = account.get('header');
  const headerStatic = account.get('header_static');
  const missing = require('images/header-missing.png');

  return account.withMutations(account => {
    account.set('header', header || headerStatic || missing);
    account.set('header_static', headerStatic || header || missing);
  });
};

/** Normalize custom fields */
const normalizeFields = (account: ImmutableMap<string, any>) => {
  return account.update('fields', ImmutableList(), fields => fields.map(FieldRecord));
};

/** Normalize emojis */
const normalizeEmojis = (entity: ImmutableMap<string, any>) => {
  const emojis = entity.get('emojis', ImmutableList()).map(normalizeEmoji);
  return entity.set('emojis', emojis);
};

/** Normalize Pleroma/Fedibird birthday */
const normalizeBirthday = (account: ImmutableMap<string, any>) => {
  const birthday = [
    account.getIn(['pleroma', 'birthday']),
    account.getIn(['other_settings', 'birthday']),
  ].find(Boolean);

  return account.set('birthday', birthday);
};

/** Get Pleroma tags */
const getTags = (account: ImmutableMap<string, any>): ImmutableList<any> => {
  const tags = account.getIn(['pleroma', 'tags']);
  return ImmutableList(ImmutableList.isList(tags) ? tags : []);
};

/** Normalize Truth Social/Pleroma verified */
const normalizeVerified = (account: ImmutableMap<string, any>) => {
  return account.update('verified', verified => {
    return [
      verified === true,
      getTags(account).includes('verified'),
    ].some(Boolean);
  });
};

/** Get donor status from tags. */
const normalizeDonor = (account: ImmutableMap<string, any>) => {
  return account.set('donor', getTags(account).includes('donor'));
};

/** Normalize Fedibird/Truth Social/Pleroma location */
const normalizeLocation = (account: ImmutableMap<string, any>) => {
  return account.update('location', location => {
    return [
      location,
      account.getIn(['pleroma', 'location']),
      account.getIn(['other_settings', 'location']),
    ].find(Boolean);
  });
};

/** Set username from acct, if applicable */
const fixUsername = (account: ImmutableMap<string, any>) => {
  const acct = account.get('acct') || '';
  const username = account.get('username') || '';
  return account.set('username', username || acct.split('@')[0]);
};

/** Set display name from username, if applicable */
const fixDisplayName = (account: ImmutableMap<string, any>) => {
  const displayName = account.get('display_name') || '';
  return account.set('display_name', displayName.trim().length === 0 ? account.get('username') : displayName);
};

/** Emojification, etc */
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

const getDomainFromURL = (account: ImmutableMap<string, any>): string => {
  try {
    const url = account.get('url');
    return new URL(url).host;
  } catch {
    return '';
  }
};

export const guessFqn = (account: ImmutableMap<string, any>): string => {
  const acct = account.get('acct', '');
  const [user, domain] = acct.split('@');

  if (domain) {
    return acct;
  } else {
    return [user, getDomainFromURL(account)].join('@');
  }
};

const normalizeFqn = (account: ImmutableMap<string, any>) => {
  const fqn = account.get('fqn') || guessFqn(account);
  return account.set('fqn', fqn);
};

const normalizeFavicon = (account: ImmutableMap<string, any>) => {
  const favicon = account.getIn(['pleroma', 'favicon']) || '';
  return account.set('favicon', favicon);
};

const addDomain = (account: ImmutableMap<string, any>) => {
  const domain = account.get('fqn', '').split('@')[1] || '';
  return account.set('domain', domain);
};

const addStaffFields = (account: ImmutableMap<string, any>) => {
  const admin = account.getIn(['pleroma', 'is_admin']) === true;
  const moderator = account.getIn(['pleroma', 'is_moderator']) === true;
  const staff = admin || moderator;

  return account.merge({
    admin,
    moderator,
    staff,
  });
};

const normalizeDiscoverable = (account: ImmutableMap<string, any>) => {
  const discoverable = Boolean(account.get('discoverable') || account.getIn(['source', 'pleroma', 'discoverable']));
  return account.set('discoverable', discoverable);
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
      normalizeDonor(account);
      normalizeBirthday(account);
      normalizeLocation(account);
      normalizeFqn(account);
      normalizeFavicon(account);
      normalizeDiscoverable(account);
      addDomain(account);
      addStaffFields(account);
      fixUsername(account);
      fixDisplayName(account);
      addInternalFields(account);
    }),
  );
};
