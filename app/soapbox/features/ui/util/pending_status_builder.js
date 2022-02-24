import { fromJS } from 'immutable';
import {
  OrderedSet as ImmutableOrderedSet,
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';

import { normalizeStatus } from 'soapbox/normalizers/status';
import { calculateStatus } from 'soapbox/reducers/statuses';
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
      mentions = ImmutableOrderedSet([account.get('acct')]).union(pendingStatus.get('to') || []);
    } else {
      mentions = pendingStatus.get('to', []);
    }

    mentions = mentions.toList().map(mention => ImmutableMap({
      username: mention.split('@')[0],
      acct: mention,
    }));
  }

  const status = {
    account,
    content: pendingStatus.get('status', '').replace(new RegExp('\n', 'g'), '<br>'), /* eslint-disable-line no-control-regex */
    id: `末pending-${idempotencyKey}`,
    in_reply_to_id: pendingStatus.get('in_reply_to_id'),
    media_attachments: pendingStatus.get('media_ids', ImmutableList()).map(id => ImmutableMap({ id })),
    mentions,
    poll: pendingStatus.get('poll', null),
    quote: pendingStatus.get('quote_id', null),
    sensitive: pendingStatus.get('sensitive', false),
    visibility: pendingStatus.get('visibility', 'public'),
  };

  return calculateStatus(normalizeStatus(fromJS(status)));
};
