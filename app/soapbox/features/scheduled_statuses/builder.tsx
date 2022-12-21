import { Map as ImmutableMap } from 'immutable';

import { normalizeStatus } from 'soapbox/normalizers/status';
import { calculateStatus } from 'soapbox/reducers/statuses';
import { makeGetAccount } from 'soapbox/selectors';

import type { ScheduledStatus } from 'soapbox/reducers/scheduled_statuses';
import type { RootState } from 'soapbox/store';

export const buildStatus = (state: RootState, scheduledStatus: ScheduledStatus) => {
  const getAccount = makeGetAccount();

  const me = state.me as string;

  const account = getAccount(state, me);

  if (!scheduledStatus) return null;

  const status = ImmutableMap({
    account,
    // eslint-disable-next-line no-control-regex
    content: scheduledStatus.text.replace(new RegExp('\n', 'g'), '<br>'),
    created_at: scheduledStatus.scheduled_at,
    id: scheduledStatus.id,
    in_reply_to_id: scheduledStatus.in_reply_to_id,
    media_attachments: scheduledStatus.media_attachments,
    poll: scheduledStatus.poll,
    sensitive: scheduledStatus.sensitive,
    uri: `/scheduled_statuses/${scheduledStatus.id}`,
    url: `/scheduled_statuses/${scheduledStatus.id}`,
    visibility: scheduledStatus.visibility,
  });

  return calculateStatus(normalizeStatus(status));
};
