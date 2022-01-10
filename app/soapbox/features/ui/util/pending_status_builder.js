import { fromJS } from 'immutable';

import { normalizeStatus } from 'soapbox/actions/importer/normalizer';
import { makeGetAccount } from 'soapbox/selectors';

export const buildStatus = (state, pendingStatus, idempotencyKey) => {
  const getAccount = makeGetAccount();

  const me = state.get('me');
  const account = getAccount(state, me);

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
    mentions: [],
    muted: false,
    pinned: false,
    poll: pendingStatus.get('poll', null),
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
