import { Map as ImmutableMap } from 'immutable';

export const getDomain = account => {
  let re = /https?:\/\/(.*?)\//i;
  return re.exec(account.get('url'))[1];
};

// user@domain even for local users
export const acctFull = account => {
  let [user, domain] = account.get('acct').split('@');
  try {
    if (!domain) domain = getDomain(account);
  } catch(e) {
    console.warning('Could not get domain for acctFull. Falling back to acct.');
    return account.get('acct');
  }
  return [user, domain].join('@');
};

export const isStaff = (account = ImmutableMap()) => {
  return ['is_admin', 'is_moderator'].some(key => (
    account.getIn(['pleroma', key]) === true
  ));
};
