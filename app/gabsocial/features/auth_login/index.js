import React from 'react';
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component';
import { createAuthApp, logIn } from 'gabsocial/actions/auth';
import { Redirect } from 'react-router-dom';

const mapStateToProps = (state, props) => ({
  me: state.get('me'),
});

class LoginForm extends ImmutablePureComponent {

  componentWillMount() {
    this.props.dispatch(createAuthApp());
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
    const { me } = this.props;

    if (me) return <Redirect to="/home" />;

    return (
      <form onSubmit={this.handleSubmit}>
        <input name='username' placeholder='me@example.com' />
        <input name='password' type='password' placeholder='Password' />
        <input type='submit' value='Login' />
      </form>
    )
  }
}

export default connect(mapStateToProps)(LoginForm);
