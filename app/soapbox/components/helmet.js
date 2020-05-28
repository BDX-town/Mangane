import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from'react-helmet';

const mapStateToProps = state => ({
  siteTitle: state.getIn(['instance', 'title']),
  unreadCount: state.getIn(['notifications', 'unread']),
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
