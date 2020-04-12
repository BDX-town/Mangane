import React from 'react';
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component';
import LoginForm from './login_form';

export default @connect()
class LoginPage extends ImmutablePureComponent {
  render() {
    return <LoginForm />
  }
}
