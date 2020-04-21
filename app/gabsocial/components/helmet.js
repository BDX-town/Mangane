import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from'react-helmet';

const mapStateToProps = state => ({
  siteTitle: state.getIn(['instance', 'title']),
});

class SoapboxHelmet extends React.Component {

  static propTypes = {
    siteTitle: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    const { siteTitle, children } = this.props;

    return (
      <Helmet
        titleTemplate={`%s | ${siteTitle}`}
        defaultTitle={siteTitle}
      >
        {children}
      </Helmet>
    );
  }

}

export default connect(mapStateToProps)(SoapboxHelmet);
