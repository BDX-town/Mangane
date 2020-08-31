import { createSelector } from 'reselect';
import { List as ImmutableList } from 'immutable';

const getAccountBase         = (state, id) => state.getIn(['accounts', id], null);
const getAccountCounters     = (state, id) => state.getIn(['accounts_counters', id], null);
const getAccountRelationship = (state, id) => state.getIn(['relationships', id], null);
const getAccountMoved        = (state, id) => state.getIn(['accounts', state.getIn(['accounts', id, 'moved'])]);
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
    getAccountPatron,
  ], (base, counters, relationship, moved, patron) => {
    if (base === null) {
      return null;
    }

    return base.merge(counters).withMutations(map => {
      map.set('relationship', relationship);
      map.set('moved', moved);
      map.set('patron', patron);
    });
  });
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
    }
  );
};

const getAlertsBase = state => state.get('alerts');

export const getAlerts = createSelector([getAlertsBase], (base) => {
  let arr = [];

  base.forEach(item => {
    arr.push({
      message: item.get('message'),
      title: item.get('title'),
      key: item.get('key'),
      dismissAfter: 5000,
      barStyle: {
        zIndex: 200,
      },
    });
  });

  return arr;
});

export const makeGetNotification = () => {
  return createSelector([
    (_, base)             => base,
    (state, _, accountId) => state.getIn(['accounts', accountId]),
  ], (base, account) => {
    return base.set('account', account);
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
      (state, { id }) => state.getIn(['chats', id]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['chats', id, 'account'])]),
      (state, { last_message }) => state.getIn(['chat_messages', last_message]),
    ],

    (chat, account, lastMessage) => {
      if (!chat) return null;

      return chat.withMutations(map => {
        map.set('account', account);
        map.set('last_message', lastMessage);
      });
    }
  );
};
