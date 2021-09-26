import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import Icon from 'soapbox/components/icon';
import { withRouter, matchPath } from 'react-router-dom';

const routes = [
  ['status',  { path: '/@:username/posts/:statusId' }],
  ['account', { path: '/@:username' }],
  ['local_timeline', { path: '/timeline/local' }],
  ['fediverse_timeline', { path: '/timeline/fediverse' }],
  ['remote_timeline', { path: '/timeline/:instance' }],
];

const findRoute = path => routes.find(v => matchPath(path, v[1]));

const findRouteType = path => {
  const route = findRoute(path) || [];
  return route[0];
};

const findMatch = path => {
  const route = findRoute(path) || [];
  return matchPath(path, route[1]);
};

const messages = defineMessages({
  status:  { id: 'sub_navigation.status',  defaultMessage: 'Post' },
  account: { id: 'sub_navigation.account', defaultMessage: 'Profile' },
  local_timeline: { id: 'sub_navigation.local_timeline', defaultMessage: '{siteTitle}' },
  fediverse_timeline: { id: 'sub_navigation.fediverse_timeline', defaultMessage: 'Fediverse' },
  remote_timeline: { id: 'sub_navigation.remote_timeline', defaultMessage: '{instance}' },
});

const mapStateToProps = state => {
  return {
    siteTitle: state.getIn(['instance', 'title']),
  };
};

export default @withRouter
@connect(mapStateToProps)
@injectIntl
class SubNavigation extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    siteTitle: PropTypes.string,
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

  getParams = () => {
    const path = this.context.router.history.location.pathname;
    return (findMatch(path) || {}).params;
  }

  render() {
    const { intl, siteTitle } = this.props;
    const message = this.getMessage();
    const params = this.getParams();

    if (!message) return null;

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
            {intl.formatMessage(message, { siteTitle, ...params })}
          </div>
        </div>
      </div>
    );
  }

}
