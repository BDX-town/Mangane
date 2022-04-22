import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { openModal } from '../../actions/modals';

const mapDispatchToProps = dispatch => ({

  onLoad: (text) => {
    dispatch(openModal('COMPOSE'));
  },

});

export default @connect(null, mapDispatchToProps)
class NewStatus extends React.Component {

  static propTypes = {
    onLoad: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.props.onLoad();
  }

  render() {
    return (
      <Redirect to='/' />
    );
  }

}
