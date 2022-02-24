import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

import { normalizeStatus } from 'soapbox/normalizers/status';
import { calculateStatus } from 'soapbox/reducers/statuses';
import { makeGetAccount } from 'soapbox/selectors';

const getAccount = makeGetAccount();

const buildMentions = pendingStatus => {
  if (pendingStatus.get('in_reply_to_id')) {
    return ImmutableList(pendingStatus.get('to') || []).map(acct => ImmutableMap({ acct }));
  } else {
    return ImmutableList();
  }
};

export const buildStatus = (state, pendingStatus, idempotencyKey) => {
  const me = state.get('me');
  const account = getAccount(state, me);
  const inReplyToId = pendingStatus.get('in_reply_to_id');

  const status = ImmutableMap({
    account,
    content: pendingStatus.get('status', '').replace(new RegExp('\n', 'g'), '<br>'), /* eslint-disable-line no-control-regex */
    id: `末pending-${idempotencyKey}`,
    in_reply_to_account_id: state.getIn(['statuses', inReplyToId, 'account'], null),
    in_reply_to_id: inReplyToId,
    media_attachments: pendingStatus.get('media_ids', ImmutableList()).map(id => ImmutableMap({ id })),
    mentions: buildMentions(pendingStatus),
    poll: pendingStatus.get('poll', null),
    quote: pendingStatus.get('quote_id', null),
    sensitive: pendingStatus.get('sensitive', false),
    visibility: pendingStatus.get('visibility', 'public'),
  });

  return calculateStatus(normalizeStatus(status));
};
