import React from 'react';
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component';

const mapStateToProps = (state, props) => ({
  me: state.get('me'),
});

class LandingPage extends ImmutablePureComponent {

  render() {
    return (
      <h1>Hello world</h1>
    )
  }
}

export default connect(mapStateToProps)(LandingPage);
