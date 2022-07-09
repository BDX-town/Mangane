import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { openModal } from 'soapbox/actions/modals';
import { cancelScheduledStatus } from 'soapbox/actions/scheduled_statuses';
import { getSettings } from 'soapbox/actions/settings';
import IconButton from 'soapbox/components/icon_button';
import { HStack } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';

import type { Status as StatusEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  cancel: { id: 'scheduled_status.cancel', defaultMessage: 'Cancel' },
  deleteConfirm: { id: 'confirmations.scheduled_status_delete.confirm', defaultMessage: 'Cancel' },
  deleteHeading: { id: 'confirmations.scheduled_status_delete.heading', defaultMessage: 'Cancel scheduled post' },
  deleteMessage: { id: 'confirmations.scheduled_status_delete.message', defaultMessage: 'Are you sure you want to cancel this scheduled post?' },
});

interface IScheduledStatusActionBar {
  status: StatusEntity,
}

const ScheduledStatusActionBar: React.FC<IScheduledStatusActionBar> = ({ status }) => {
  const intl = useIntl();

  const dispatch = useAppDispatch();

  const handleCancelClick = () => {
    dispatch((_, getState) => {

      const deleteModal = getSettings(getState()).get('deleteModal');
      if (!deleteModal) {
        dispatch(cancelScheduledStatus(status.id));
      } else {
        dispatch(openModal('CONFIRM', {
          icon: require('@tabler/icons/calendar-stats.svg'),
          heading: intl.formatMessage(messages.deleteHeading),
          message: intl.formatMessage(messages.deleteMessage),
          confirm: intl.formatMessage(messages.deleteConfirm),
          onConfirm: () => dispatch(cancelScheduledStatus(status.id)),
        }));
      }
    });
  };

  return (
    <HStack justifyContent='end'>
      <IconButton
        title={intl.formatMessage(messages.cancel)}
        text={intl.formatMessage(messages.cancel)}
        src={require('@tabler/icons/x.svg')}
        onClick={handleCancelClick}
      />
    </HStack>
  );
};

export default ScheduledStatusActionBar;
