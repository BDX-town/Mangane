import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { Button } from 'soapbox/components/ui';

const ComposeButton = () => {
  const history = useHistory();
  const onOpenCompose = () => {
    history.push('/statuses/new');
  };

  return (
    <div className='mt-4'>
      <Button icon={require('@tabler/icons/pencil-plus.svg')} block size='lg' onClick={onOpenCompose}>
        <span><FormattedMessage id='navigation.compose' defaultMessage='Compose' /></span>
      </Button>
    </div>
  );
};

export default ComposeButton;
