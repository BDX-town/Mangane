import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Icon from 'soapbox/components/icon';
import { Modal, Stack, Text } from 'soapbox/components/ui';
import ReplyIndicator from 'soapbox/features/compose/components/reply_indicator';

import type { Status as StatusEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  cancel_reblog: { id: 'status.cancel_reblog_private', defaultMessage: 'Un-repost' },
  reblog: { id: 'status.reblog', defaultMessage: 'Repost' },
});

interface IBoostModal {
  status: StatusEntity,
  onReblog: (status: StatusEntity) => void,
  onClose: () => void,
}

const BoostModal: React.FC<IBoostModal> = ({ status, onReblog, onClose }) => {
  const intl = useIntl();

  const handleReblog = () => {
    onReblog(status);
    onClose();
  };

  const buttonText = status.reblogged ? messages.cancel_reblog : messages.reblog;

  return (
    <Modal
      title='Repost?'
      confirmationAction={handleReblog}
      confirmationText={intl.formatMessage(buttonText)}
    >
      <Stack space={4}>
        <ReplyIndicator status={status} hideActions />

        <Text>
          <FormattedMessage id='boost_modal.combo' defaultMessage='You can press {combo} to skip this next time' values={{ combo: <span>Shift + <Icon className='inline-block align-middle' src={require('@tabler/icons/repeat.svg')} /></span> }} />
        </Text>
      </Stack>
    </Modal>
  );
};

export default BoostModal;
