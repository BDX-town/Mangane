import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from'react-helmet';

const getNotifTotals = state => {
  const notifications = state.getIn(['notifications', 'unread'], 0);
  const chats = state.get('chats').reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0);
  const reports = state.getIn(['admin', 'open_report_count'], 0);
  return notifications + chats + reports;
};

const mapStateToProps = state => ({
  siteTitle: state.getIn(['instance', 'title']),
  unreadCount: getNotifTotals(state),
});

class SoapboxHelmet extends React.Component {

  static propTypes = {
    siteTitle: PropTypes.string,
    children: PropTypes.node,
    unreadCount: PropTypes.number,
  };

  addCounter = title => {
    const { unreadCount } = this.props;
    if (unreadCount < 1) return title;
    return `(${unreadCount}) ${title}`;
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

export default connect(mapStateToProps)(SoapboxHelmet);
