import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getSettings } from 'soapbox/actions/settings';
// import sourceCode from 'soapbox/utils/code';
import FaviconService from 'soapbox/utils/favicon_service';

FaviconService.initFaviconService();

const getNotifTotals = state => {
  const notifications = state.getIn(['notifications', 'unread'], 0);
  const chats = state.getIn(['chats', 'items']).reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0);
  const reports = state.getIn(['admin', 'openReports']).count();
  const approvals = state.getIn(['admin', 'awaitingApproval']).count();
  return notifications + chats + reports + approvals;
};

const mapStateToProps = state => {
  const settings = getSettings(state);

  return {
    siteTitle: state.getIn(['instance', 'title']),
    unreadCount: getNotifTotals(state),
    demetricator: settings.get('demetricator'),
  };
};

class SoapboxHelmet extends React.Component {

  static propTypes = {
    siteTitle: PropTypes.string,
    children: PropTypes.node,
    unreadCount: PropTypes.number,
    demetricator: PropTypes.bool,
  };

  hasUnread = () => {
    const { unreadCount, demetricator } = this.props;
    return !(unreadCount < 1 || demetricator);
  }

  addCounter = title => {
    const { unreadCount } = this.props;
    const hasUnread = this.hasUnread();
    return hasUnread ? `(${unreadCount}) ${title}` : title;
  }

  updateFaviconBadge = () => {
    const hasUnread = this.hasUnread();

    if (hasUnread) {
      FaviconService.drawFaviconBadge();
    } else {
      FaviconService.clearFaviconBadge();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.unreadCount !== prevProps.unreadCount || this.props.demetricator !== prevProps.demetricator) {
      this.updateFaviconBadge();
    }
  }

  componentDidMount() {
    this.updateFaviconBadge();
  }

  render() {
    const { siteTitle, children } = this.props;

    return (
      <Helmet
        titleTemplate={this.addCounter(`%s | ${siteTitle}`)}
        defaultTitle={this.addCounter(siteTitle)}
        defer={false}
      >
        {children}
      </Helmet>
    );
  }

}

export default withRouter(connect(mapStateToProps)(SoapboxHelmet));
