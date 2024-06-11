// import throttle from 'lodash/throttle';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
// import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

// import { openModal } from 'soapbox/actions/modals';
// import { useAppDispatch } from 'soapbox/hooks';

import { CardHeader, CardTitle } from './ui';

const messages = defineMessages({
  back: { id: 'column_back_button.label', defaultMessage: 'Back' },
  settings: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
});

interface ISubNavigation {
  message?: String,
  settings?: React.ComponentType,
  children?: React.ReactNode,
}

const SubNavigation: React.FC<ISubNavigation> = ({ message, children }) => {
  const intl = useIntl();
  const history = useHistory();


  const handleBackClick = () => {
    if (window.history && window.history.length === 1) {
      history.push('/');
    } else {
      history.goBack();
    }
  };

  return (
    <CardHeader
      aria-label={intl.formatMessage(messages.back)}
      onBackClick={handleBackClick}
    >
      { !children ? <CardTitle title={message} /> : children }
    </CardHeader>
  );
};

export default SubNavigation;
