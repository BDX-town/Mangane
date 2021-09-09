import { fromJS } from 'immutable';
import { normalizeStatus } from 'soapbox/actions/importer/normalizer';
import { makeGetAccount } from 'soapbox/selectors';

export const buildStatus = (state, scheduledStatus) => {
  const getAccount = makeGetAccount();

  const me = state.get('me');
  const params = scheduledStatus.get('params');
  const account = getAccount(state, me);

  const status = normalizeStatus({
    account,
    application: null,
    bookmarked: false,
    card: null,
    content: params.get('text', '').replaceAll('\n', '<br>'),
    created_at: params.get('scheduled_at'),
    emojis: [],
    favourited: false,
    favourites_count: 0,
    id: scheduledStatus.get('id'),
    in_reply_to_account_id: null,
    in_reply_to_id: params.get('in_reply_to_id'),
    language: null,
    media_attachments: scheduledStatus.get('media_attachments'),
    mentions: [],
    muted: false,
    pinned: false,
    poll: params.get('poll'),
    reblog: null,
    reblogged: false,
    reblogs_count: 0,
    replies_count: 0,
    sensitive: params.get('sensitive'),
    spoiler_text: '',
    tags: [],
    text: null,
    uri: `/scheduled_statuses/${scheduledStatus.get('id')}`,
    url: `/scheduled_statuses/${scheduledStatus.get('id')}`,
    visibility: params.get('visibility'),
  });

  return fromJS(status).set('account', account);
};
