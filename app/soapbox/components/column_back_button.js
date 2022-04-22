import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import Icon from 'soapbox/components/icon';

export default @withRouter
class ColumnBackButton extends React.PureComponent {

  static propTypes = {
    to: PropTypes.string,
    history: PropTypes.object,
  };

  handleClick = () => {
    const { to } = this.props;

    if (window.history?.length === 1) {
      this.props.history.push(to ? to : '/');
    } else {
      this.props.history.goBack();
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
