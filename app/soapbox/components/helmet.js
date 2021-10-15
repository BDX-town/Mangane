import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Helmet } from'react-helmet';
import { getSettings } from 'soapbox/actions/settings';
import sourceCode from 'soapbox/utils/code';
import FaviconService from 'soapbox/utils/favicon_service';

const getNotifTotals = state => {
  const notifications = state.getIn(['notifications', 'unread'], 0);
  const chats = state.get('chats').reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0);
  const reports = state.getIn(['admin', 'openReports']).count();
  const approvals = state.getIn(['admin', 'awaitingApproval']).count();
  return notifications + chats + reports + approvals;
};

const mapStateToProps = state => {
  const settings = getSettings(state);

  return {
    siteTitle: state.getIn(['instance', 'title'], sourceCode.displayName),
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

  addCounter = title => {
    const { unreadCount, demetricator } = this.props;

    if (unreadCount < 1 || demetricator) {
      // Erase badge when there are no notifications
      FaviconService.clearFaviconBadge();
      return title;
    } else {
      FaviconService.drawFaviconBadge();
      return `(${unreadCount}) ${title}`;
    }
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
