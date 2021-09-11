import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Icon from 'soapbox/components/icon';

export default class ColumnBackButton extends React.PureComponent {

  static propTypes = {
    to: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  handleClick = () => {
    const { to } = this.props;

    if (window.history && window.history.length === 1) {
      this.context.router.history.push(to ? to : '/');
    } else {
      this.context.router.history.goBack();
    }
  }

  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  }

  render() {
    return (
      <button onClick={this.handleClick} onKeyUp={this.handleKeyUp} className='column-back-button'>
        <Icon id='chevron-left' className='column-back-button__icon' fixedWidth />
        <FormattedMessage id='column_back_button.label' defaultMessage='Back' />
      </button>
    );
  }

}
