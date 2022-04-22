import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import IconButton from '../../../components/icon_button';

import Column from './column';
import ColumnHeader from './column_header';

const messages = defineMessages({
  title: { id: 'bundle_column_error.title', defaultMessage: 'Network error' },
  body: { id: 'bundle_column_error.body', defaultMessage: 'Something went wrong while loading this component.' },
  retry: { id: 'bundle_column_error.retry', defaultMessage: 'Try again' },
});

class BundleColumnError extends React.PureComponent {

  static propTypes = {
    onRetry: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  handleRetry = () => {
    this.props.onRetry();
  }

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <Column>
        <ColumnHeader icon='exclamation-circle' type={formatMessage(messages.title)} />
        <div className='error-column'>
          <IconButton title={formatMessage(messages.retry)} src={require('@tabler/icons/icons/refresh.svg')} onClick={this.handleRetry} />
          {formatMessage(messages.body)}
        </div>
      </Column>
    );
  }

}

export default injectIntl(BundleColumnError);
