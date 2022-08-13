import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Icon from 'soapbox/components/icon';

const messages = defineMessages({
  load_more: { id: 'status.load_more', defaultMessage: 'Load more' },
});

interface ILoadGap {
  disabled?: boolean,
  maxId: string,
  onClick: (id: string) => void,
}

const LoadGap: React.FC<ILoadGap> = ({ disabled, maxId, onClick }) => {
  const intl = useIntl();

  const handleClick = () => onClick(maxId);

  return (
    <button className='load-more load-gap' disabled={disabled} onClick={handleClick} aria-label={intl.formatMessage(messages.load_more)}>
      <Icon src={require('@tabler/icons/dots.svg')} />
    </button>
  );
};

export default LoadGap;
