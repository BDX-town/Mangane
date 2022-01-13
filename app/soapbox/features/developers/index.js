import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';

import DevelopersChallenge from './developers_challenge';
import DevelopersMenu from './developers_menu';

const mapStateToProps = state => {
  const settings = getSettings(state);

  return {
    isDeveloper: settings.get('isDeveloper'),
  };
};

export default @connect(mapStateToProps)
class Developers extends React.Component {

  static propTypes = {
    isDeveloper: PropTypes.bool.isRequired,
  }

  render() {
    const { isDeveloper } = this.props;
    return isDeveloper ? <DevelopersMenu /> : <DevelopersChallenge />;
  }

}
