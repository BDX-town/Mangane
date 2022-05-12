import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { Button } from 'soapbox/components/ui';

const ComposeButton = () => {
  const dispatch = useDispatch();
  const onOpenCompose = () => dispatch(openModal('COMPOSE'));

  return (
    <div className='mt-4'>
      <Button icon={require('icons/pen-plus.svg')} block size='lg' onClick={onOpenCompose}>
        <span><FormattedMessage id='navigation.compose' defaultMessage='Compose' /></span>
      </Button>
    </div>
  );
};

export default ComposeButton;
