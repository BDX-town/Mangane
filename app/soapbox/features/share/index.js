import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { changeCompose } from '../../actions/compose';
import { openModal } from '../../actions/modal';

const mapDispatchToProps = dispatch => ({

  onShare: (text) => {
    dispatch(openModal('COMPOSE'));
    dispatch(changeCompose(text));
  },

});

export default @connect(null, mapDispatchToProps)
class Share extends ImmutablePureComponent {

  static propTypes = {
    onShare: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const text = new URLSearchParams(window.location.search).get('text');
    if (text) this.props.onShare(text);
  }

  render() {
    return (
      <Redirect to='/' />
    );
  }

}
