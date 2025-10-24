// import throttle from 'lodash/throttle';
import React, { ReactNode } from 'react';
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
  message?: ReactNode,
  settings?: React.ComponentType,
  children?: React.ReactNode,
  className?: string,
}

const SubNavigation: React.FC<ISubNavigation> = ({ message, children, className }) => {
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
      className={className}
      aria-label={intl.formatMessage(messages.back)}
      onBackClick={handleBackClick}
    >
      { !children ? <CardTitle title={message} /> : children }
    </CardHeader>
  );
};

export default SubNavigation;
