import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import Column from './column';

const messages = defineMessages({
  title: { id: 'column_forbidden.title', defaultMessage: 'Forbidden' },
  body: { id: 'column_forbidden.body', defaultMessage: 'You do not have permission to access this page.' },
});

class ColumnForbidden extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <Column label={formatMessage(messages.title)}>
        <div className='error-column'>
          {formatMessage(messages.body)}
        </div>
      </Column>
    );
  }

}

export default injectIntl(ColumnForbidden);
