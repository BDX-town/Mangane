import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import { normalizeStatus } from 'soapbox/normalizers/status';
import { calculateStatus } from 'soapbox/reducers/statuses';
import { makeGetAccount } from 'soapbox/selectors';

const getAccount = makeGetAccount();

const getMentions = pendingStatus => {
  if (pendingStatus.get('in_reply_to_id')) {
    return ImmutableList(pendingStatus.get('to') || []).map(mention => ImmutableMap({
      username: mention.split('@')[0],
      acct: mention,
    }));
  } else {
    return ImmutableList();
  }
};

export const buildStatus = (state, pendingStatus, idempotencyKey) => {
  const me = state.get('me');
  const account = getAccount(state, me);
  const inReplyToId = pendingStatus.get('in_reply_to_id');

  const status = {
    account,
    content: pendingStatus.get('status', '').replace(new RegExp('\n', 'g'), '<br>'), /* eslint-disable-line no-control-regex */
    id: `末pending-${idempotencyKey}`,
    in_reply_to_account_id: state.getIn(['statuses', inReplyToId, 'account'], null),
    in_reply_to_id: inReplyToId,
    media_attachments: pendingStatus.get('media_ids', ImmutableList()).map(id => ImmutableMap({ id })),
    mentions: getMentions(pendingStatus),
    poll: pendingStatus.get('poll', null),
    quote: pendingStatus.get('quote_id', null),
    sensitive: pendingStatus.get('sensitive', false),
    visibility: pendingStatus.get('visibility', 'public'),
  };

  return calculateStatus(normalizeStatus(fromJS(status)));
};
