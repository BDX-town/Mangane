import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { compose } from 'soapbox/actions/compose';
import { Button } from 'soapbox/components/ui';

const ComposeButton = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const intl = useIntl();

  const onOpenCompose = useCallback(() => {
    dispatch(compose(history, intl));
  }, [history]);

  return (
    <div className='mt-4'>
      <Button icon={require('@tabler/icons/pencil-plus.svg')} block size='lg' onClick={onOpenCompose}>
        <span><FormattedMessage id='navigation.compose' defaultMessage='Compose' /></span>
      </Button>
    </div>
  );
};

export default ComposeButton;
