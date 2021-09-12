import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import Icon from 'soapbox/components/icon';
import { withRouter } from 'react-router-dom';
import { matchPath } from 'react-router-dom';

const routes = [
  ['status',  { path: '/@:username/posts/:statusId' }],
  ['account', { path: '/@:username' }],
];

const findRouteType = path => {
  const route = routes.find(v => matchPath(path, v[1])) || [];
  return route[0];
};

const messages = defineMessages({
  status:  { id: 'sub_navigation.status',  defaultMessage: 'Post' },
  account: { id: 'sub_navigation.account', defaultMessage: 'Profile' },
});

export default @withRouter
@injectIntl
class SubNavigation extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
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

  getMessage = () => {
    const path = this.context.router.history.location.pathname;
    const type = findRouteType(path);

    return messages[type] || null;
  }

  render() {
    const { intl } = this.props;
    const message = this.getMessage();

    if (!message) return null;

    return (
      <div className='sub-navigation'>
        <button
          className='sub-navigation__back'
          onClick={this.handleBackClick}
          onKeyUp={this.handleBackKeyUp}
        >
          <Icon id='chevron-left' />
          <FormattedMessage id='sub_navigation.back' defaultMessage='Back' />
        </button>
        <div className='sub-navigation__message'>
          {intl.formatMessage(message)}
        </div>
      </div>
    );
  }

}
