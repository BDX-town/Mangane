import React from 'react';
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component';
import { createApp, logIn } from 'gabsocial/actions/auth';

class LoginForm extends ImmutablePureComponent {

  componentWillMount() {
    this.props.dispatch(createApp());
  }

  getFormData = (form) => {
    return Object.fromEntries(
      Array.from(form).map(i => [i.name, i.value])
    );
  }

  handleSubmit = (event) => {
    const {username, password} = this.getFormData(event.target);
    this.props.dispatch(logIn(username, password));
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input name='username' placeholder='me@example.com' />
        <input name='password' type='password' placeholder='Password' />
        <input type='submit' value='Login' />
      </form>
    )
  }
}

export default connect()(LoginForm);
