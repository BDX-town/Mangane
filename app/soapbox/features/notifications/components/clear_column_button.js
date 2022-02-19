import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from 'soapbox/components/icon';

export default class ClearColumnButton extends React.PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  render() {
    return (
      <button className='text-btn column-header__setting-btn' tabIndex='0' onClick={this.props.onClick}><Icon src={require('@tabler/icons/icons/eraser.svg')} /> <FormattedMessage id='notifications.clear' defaultMessage='Clear notifications' /></button>
    );
  }

}
