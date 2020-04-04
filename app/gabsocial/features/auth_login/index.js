import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';

export default class LoginForm extends ImmutablePureComponent {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getFormData(form) {
    return Object.fromEntries(
      Array.from(form).map(i => [i.name, i.value])
    );
  }

  handleSubmit(event) {
    const {username, password} = this.getFormData(event.target);
    console.log(username + ' ' + password);
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
