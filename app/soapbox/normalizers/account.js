import { Map as ImmutableMap, List as ImmutableList, Record } from 'immutable';

import { mergeDefined } from 'soapbox/utils/normalizers';

const AccountRecord = Record({
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
  verified: false,

  // Internal fields
  display_name_html: '',
  note_emojified: '',
  note_plain: '',
  patron: ImmutableMap(),
  relationship: ImmutableList(),
  should_refetch: false,
});

// https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/549
const normalizePleromaLegacyFields = account => {
  return account.update('pleroma', ImmutableMap(), pleroma => {
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

// Normalize Pleroma/Fedibird birthday
const normalizeBirthday = account => {
  const birthday = [
    account.getIn(['pleroma', 'birthday']),
    account.getIn(['other_settings', 'birthday']),
  ].find(Boolean);

  return account.set('birthday', birthday);
};

// Normalize Truth Social/Pleroma verified
const normalizeVerified = account => {
  return account.update('verified', verified => {
    return [
      verified === true,
      account.getIn(['pleroma', 'tags'], ImmutableList()).includes('verified'),
    ].some(Boolean);
  });
};

// Normalize Fedibird/Truth Social location
const normalizeLocation = account => {
  return account.update('location', location => {
    return [
      location,
      account.getIn(['other_settings', 'location']),
    ].find(Boolean);
  });
};

export const normalizeAccount = account => {
  return AccountRecord(
    account.withMutations(account => {
      normalizePleromaLegacyFields(account);
      normalizeVerified(account);
      normalizeBirthday(account);
      normalizeLocation(account);
    }),
  );
};
