import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from'react-helmet';

const getNotifTotals = state => {
  const normNotif = state.getIn(['notifications', 'unread']);
  const chatNotif = state.get('chats').reduce((acc, curr) => acc + curr.get('unread'), 0);
  const notifTotals = normNotif + chatNotif;
  return notifTotals;
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
      >
        {children}
      </Helmet>
    );
  }

}

export default connect(mapStateToProps)(SoapboxHelmet);
