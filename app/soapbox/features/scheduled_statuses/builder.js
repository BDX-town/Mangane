import { Map as ImmutableMap } from 'immutable';

import { normalizeStatus } from 'soapbox/normalizers/status';
import { calculateStatus } from 'soapbox/reducers/statuses';
import { makeGetAccount } from 'soapbox/selectors';

export const buildStatus = (state, scheduledStatus) => {
  const getAccount = makeGetAccount();

  const me = state.get('me');
  const params = scheduledStatus.get('params');
  const account = getAccount(state, me);

  const status = ImmutableMap({
    account,
    content: params.get('text', '').replace(new RegExp('\n', 'g'), '<br>'), /* eslint-disable-line no-control-regex */
    created_at: params.get('scheduled_at'),
    id: scheduledStatus.get('id'),
    in_reply_to_id: params.get('in_reply_to_id'),
    media_attachments: scheduledStatus.get('media_attachments'),
    poll: params.get('poll'),
    sensitive: params.get('sensitive'),
    uri: `/scheduled_statuses/${scheduledStatus.get('id')}`,
    url: `/scheduled_statuses/${scheduledStatus.get('id')}`,
    visibility: params.get('visibility'),
  });

  return calculateStatus(normalizeStatus(status));
};
