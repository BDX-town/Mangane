import {
  Map as ImmutableMap,
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
} from 'immutable';
import { createSelector } from 'reselect';

import { getSettings } from 'soapbox/actions/settings';
import { getDomain } from 'soapbox/utils/accounts';
import { validId } from 'soapbox/utils/auth';
import ConfigDB from 'soapbox/utils/config_db';
import { shouldFilter } from 'soapbox/utils/timelines';

const getAccountBase         = (state, id) => state.getIn(['accounts', id], null);
const getAccountCounters     = (state, id) => state.getIn(['accounts_counters', id], null);
const getAccountRelationship = (state, id) => state.getIn(['relationships', id], null);
const getAccountMoved        = (state, id) => state.getIn(['accounts', state.getIn(['accounts', id, 'moved'])]);
const getAccountMeta         = (state, id) => state.getIn(['accounts_meta', id], ImmutableMap());
const getAccountAdminData    = (state, id) => state.getIn(['admin', 'users', id]);
const getAccountPatron       = (state, id) => {
  const url = state.getIn(['accounts', id, 'url']);
  return state.getIn(['patron', 'accounts', url]);
};

export const makeGetAccount = () => {
  return createSelector([
    getAccountBase,
    getAccountCounters,
    getAccountRelationship,
    getAccountMoved,
    getAccountMeta,
    getAccountAdminData,
    getAccountPatron,
  ], (base, counters, relationship, moved, meta, admin, patron) => {
    if (base === null) {
      return null;
    }

    return base.withMutations(map => {
      map.merge(counters);
      map.merge(meta);
      map.set('pleroma', meta.get('pleroma', ImmutableMap()).merge(base.get('pleroma', ImmutableMap()))); // Lol, thanks Pleroma
      map.set('relationship', relationship);
      map.set('moved', moved);
      map.set('patron', patron);
      map.setIn(['pleroma', 'admin'], admin);
    });
  });
};

const findAccountsByUsername = (state, username) => {
  const accounts = state.get('accounts');

  return accounts.filter(account => {
    return username.toLowerCase() === account.getIn(['acct'], '').toLowerCase();
  });
};

export const findAccountByUsername = (state, username) => {
  const accounts = findAccountsByUsername(state, username);

  if (accounts.size > 1) {
    const me = state.get('me');
    const meURL = state.getIn(['accounts', me, 'url']);

    return accounts.find(account => {
      try {
        // If more than one account has the same username, try matching its host
        const { host } = new URL(account.get('url'));
        const { host: meHost } = new URL(meURL);
        return host === meHost;
      } catch {
        return false;
      }
    });
  } else {
    return accounts.first();
  }
};

const toServerSideType = columnType => {
  switch (columnType) {
  case 'home':
  case 'notifications':
  case 'public':
  case 'thread':
    return columnType;
  default:
    if (columnType.indexOf('list:') > -1) {
      return 'home';
    } else {
      return 'public'; // community, account, hashtag
    }
  }
};

export const getFilters = (state, { contextType }) => state.get('filters', ImmutableList()).filter(filter => contextType && filter.get('context').includes(toServerSideType(contextType)) && (filter.get('expires_at') === null || Date.parse(filter.get('expires_at')) > (new Date())));

const escapeRegExp = string =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

export const regexFromFilters = filters => {
  if (filters.size === 0) {
    return null;
  }

  return new RegExp(filters.map(filter => {
    let expr = escapeRegExp(filter.get('phrase'));

    if (filter.get('whole_word')) {
      if (/^[\w]/.test(expr)) {
        expr = `\\b${expr}`;
      }

      if (/[\w]$/.test(expr)) {
        expr = `${expr}\\b`;
      }
    }

    return expr;
  }).join('|'), 'i');
};

export const makeGetStatus = () => {
  return createSelector(
    [
      (state, { id }) => state.getIn(['statuses', id]),
      (state, { id }) => state.getIn(['statuses', state.getIn(['statuses', id, 'reblog'])]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['statuses', id, 'account'])]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['statuses', state.getIn(['statuses', id, 'reblog']), 'account'])]),
      (state, { username }) => username,
      getFilters,
      (state)         => state.get('me'),
    ],

    (statusBase, statusReblog, accountBase, accountReblog, username, filters, me) => {
      if (!statusBase) {
        return null;
      }

      const accountUsername = accountBase.get('acct');
      //Must be owner of status if username exists
      if (accountUsername !== username && username !== undefined) {
        return null;
      }

      if (statusReblog) {
        statusReblog = statusReblog.set('account', accountReblog);
      } else {
        statusReblog = null;
      }

      const regex    = (accountReblog || accountBase).get('id') !== me && regexFromFilters(filters);
      const filtered = regex && regex.test(statusBase.get('reblog') ? statusReblog.get('search_index') : statusBase.get('search_index'));

      return statusBase.withMutations(map => {
        map.set('reblog', statusReblog);
        map.set('account', accountBase);
        map.set('filtered', filtered);
      });
    },
  );
};

const getAlertsBase = state => state.get('alerts');

export const getAlerts = createSelector([getAlertsBase], (base) => {
  const arr = [];

  base.forEach(item => {
    arr.push({
      message: item.get('message'),
      title: item.get('title'),
      actionLabel: item.get('actionLabel'),
      actionLink: item.get('actionLink'),
      key: item.get('key'),
      className: `notification-bar-${item.get('severity', 'info')}`,
      activeClassName: 'snackbar--active',
      dismissAfter: 6000,
      style: false,
    });
  });

  return arr;
});

export const makeGetNotification = () => {
  return createSelector([
    (state, notification) => notification,
    (state, notification) => state.getIn(['accounts', notification.get('account')]),
    (state, notification) => state.getIn(['accounts', notification.get('target')]),
    (state, notification) => state.getIn(['statuses', notification.get('status')]),
  ], (notification, account, target, status) => {
    return notification.merge({ account, target, status });
  });
};

export const getAccountGallery = createSelector([
  (state, id) => state.getIn(['timelines', `account:${id}:media`, 'items'], ImmutableList()),
  state       => state.get('statuses'),
  state       => state.get('accounts'),
], (statusIds, statuses, accounts) => {

  return statusIds.reduce((medias, statusId) => {
    const status = statuses.get(statusId);
    const account = accounts.get(status.get('account'));
    if (status.get('reblog')) return medias;
    return medias.concat(status.get('media_attachments')
      .map(media => media.merge({ status, account })));
  }, ImmutableList());
});

export const makeGetChat = () => {
  return createSelector(
    [
      (state, { id }) => state.getIn(['chats', 'items', id]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['chats', 'items', id, 'account'])]),
      (state, { last_message }) => state.getIn(['chat_messages', last_message]),
    ],

    (chat, account, lastMessage) => {
      if (!chat) return null;

      return chat.withMutations(map => {
        map.set('account', account);
        map.set('last_message', lastMessage);
      });
    },
  );
};

export const makeGetReport = () => {
  const getStatus = makeGetStatus();

  return createSelector(
    [
      (state, id) => state.getIn(['admin', 'reports', id]),
      (state, id) => state.getIn(['admin', 'reports', id, 'statuses']).map(
        statusId => state.getIn(['statuses', statusId]))
        .filter(s => s)
        .map(s => getStatus(state, s.toJS())),
    ],

    (report, statuses) => {
      if (!report) return null;
      return report.set('statuses', statuses);
    },
  );
};

const getAuthUserIds = createSelector([
  state => state.getIn(['auth', 'users'], ImmutableMap()),
], authUsers => {
  return authUsers.reduce((ids, authUser) => {
    try {
      const id = authUser.get('id');
      return validId(id) ? ids.add(id) : ids;
    } catch {
      return ids;
    }
  }, ImmutableOrderedSet());
});

export const makeGetOtherAccounts = () => {
  return createSelector([
    state => state.get('accounts'),
    getAuthUserIds,
    state => state.get('me'),
  ],
  (accounts, authUserIds, me) => {
    return authUserIds
      .reduce((list, id) => {
        if (id === me) return list;
        const account = accounts.get(id);
        return account ? list.push(account) : list;
      }, ImmutableList());
  });
};

const getSimplePolicy = createSelector([
  state => state.getIn(['admin', 'configs'], ImmutableMap()),
  state => state.getIn(['instance', 'pleroma', 'metadata', 'federation', 'mrf_simple'], ImmutableMap()),
], (configs, instancePolicy) => {
  return instancePolicy.merge(ConfigDB.toSimplePolicy(configs));
});

const getRemoteInstanceFavicon = (state, host) => (
  state.get('accounts')
    .find(account => getDomain(account) === host, null, ImmutableMap())
    .getIn(['pleroma', 'favicon'])
);

const getRemoteInstanceFederation = (state, host) => (
  getSimplePolicy(state)
    .map(hosts => hosts.includes(host))
);

export const makeGetHosts = () => {
  return createSelector([getSimplePolicy], (simplePolicy) => {
    return simplePolicy
      .deleteAll(['accept', 'reject_deletes', 'report_removal'])
      .reduce((acc, hosts) => acc.union(hosts), ImmutableOrderedSet())
      .sort();
  });
};

export const makeGetRemoteInstance = () => {
  return createSelector([
    (state, host) => host,
    getRemoteInstanceFavicon,
    getRemoteInstanceFederation,
  ], (host, favicon, federation) => {
    return ImmutableMap({
      host,
      favicon,
      federation,
    });
  });
};

export const makeGetStatusIds = () => createSelector([
  (state, { type, prefix }) => getSettings(state).get(prefix || type, ImmutableMap()),
  (state, { type }) => state.getIn(['timelines', type, 'items'], ImmutableOrderedSet()),
  (state)           => state.get('statuses'),
  (state)           => state.get('me'),
], (columnSettings, statusIds, statuses, me) => {
  return statusIds.filter(id => {
    const status = statuses.get(id);
    if (!status) return true;
    return !shouldFilter(status, columnSettings);
  });
});
