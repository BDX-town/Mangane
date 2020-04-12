import React from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import ImmutablePureComponent from 'react-immutable-pure-component';
import LoginForm from './login_form';

const mapStateToProps = state => ({
  me: state.get('me'),
});

export default @connect(mapStateToProps)
class LoginPage extends ImmutablePureComponent {
  render() {
    const { me } = this.props;
    if (me) return <Redirect to='/' />;

    return <LoginForm />
  }
}
