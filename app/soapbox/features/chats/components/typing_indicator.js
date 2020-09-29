import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export default class TypingIndicator extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
  };

  render() {
    const { active } = this.props;

    if (!active) {
      return null;
    }

    return (
      <div className='typing-indicator'>
        <div className='typing-indicator__message'>
          <FormattedMessage id='typing-indicator.label' defaultMessage='Active typing...' />
        </div>
      </div>
    );
  }

}
