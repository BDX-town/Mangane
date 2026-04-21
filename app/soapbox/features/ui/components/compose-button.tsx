import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { compose } from 'soapbox/actions/compose';
import { Button } from 'soapbox/components/ui';

const ComposeButton = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onOpenCompose = useCallback(() => {
    dispatch(compose());
    history.push('/statuses/compose');
  }, [dispatch, history]);

  return (
    <div className='mt-4'>
      <Button icon={require('@tabler/icons/pencil-plus.svg')} block size='lg' onClick={onOpenCompose}>
        <span><FormattedMessage id='navigation.compose' defaultMessage='Compose' /></span>
      </Button>
    </div>
  );
};

export default ComposeButton;
