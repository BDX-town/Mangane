import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from 'soapbox/components/icon';

export default class SubNavigation extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    message: PropTypes.string,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  handleBackClick = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/');
    } else {
      this.context.router.history.goBack();
    }
  }

  handleBackKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  }

  render() {
    const { message } = this.props;

    return (
      <div className='sub-navigation'>
        <div className='sub-navigation__content'>
          <button
            className='sub-navigation__back'
            onClick={this.handleBackClick}
            onKeyUp={this.handleBackKeyUp}
          >
            <Icon src={require('@tabler/icons/icons/arrow-back.svg')} />
            <FormattedMessage id='sub_navigation.back' defaultMessage='Back' />
          </button>
          <div className='sub-navigation__message'>
            {message}
          </div>
        </div>
      </div>
    );
  }

}
