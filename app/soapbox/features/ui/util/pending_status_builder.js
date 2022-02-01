import { fromJS } from 'immutable';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';

import { normalizeStatus } from 'soapbox/actions/importer/normalizer';
import { makeGetAccount, makeGetStatus } from 'soapbox/selectors';

export const buildStatus = (state, pendingStatus, idempotencyKey) => {
  const getAccount = makeGetAccount();
  const getStatus = makeGetStatus();

  const me = state.get('me');
  const account = getAccount(state, me);

  let mentions;
  if (pendingStatus.get('in_reply_to_id')) {
    const inReplyTo = getStatus(state, { id: pendingStatus.get('in_reply_to_id') });

    if (inReplyTo.getIn(['account', 'id']) === me) {
      mentions = ImmutableOrderedSet([account.get('acct')]).union(pendingStatus.get('to', []));
    } else {
      mentions = pendingStatus.get('to', []);
    }

    mentions = mentions.map(mention => ({
      username: mention.split('@')[0],
    }));
  }

  const status = normalizeStatus({
    account,
    application: null,
    bookmarked: false,
    card: null,
    content: pendingStatus.get('status', '').replace(new RegExp('\n', 'g'), '<br>'), /* eslint-disable-line no-control-regex */
    created_at: new Date(),
    emojis: [],
    favourited: false,
    favourites_count: 0,
    id: `末pending-${idempotencyKey}`,
    in_reply_to_account_id: null,
    in_reply_to_id: pendingStatus.get('in_reply_to_id'),
    language: null,
    media_attachments: pendingStatus.get('media_ids').map(id => ({ id })),
    mentions,
    muted: false,
    pinned: false,
    poll: pendingStatus.get('poll', null),
    quote: pendingStatus.get('quote_id', null),
    reblog: null,
    reblogged: false,
    reblogs_count: 0,
    replies_count: 0,
    sensitive: pendingStatus.get('sensitive', false),
    spoiler_text: '',
    tags: [],
    text: null,
    uri: '',
    url: '',
    visibility: pendingStatus.get('visibility', 'public'),
  });

  return fromJS(status).set('account', account);
};
