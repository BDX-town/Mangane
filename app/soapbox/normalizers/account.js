import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

import { mergeDefined } from 'soapbox/utils/normalizers';

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
  return account.withMutations(account => {
    normalizePleromaLegacyFields(account);
    normalizeVerified(account);
    normalizeBirthday(account);
    normalizeLocation(account);
  });
};
