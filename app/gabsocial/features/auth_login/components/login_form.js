import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { logIn } from 'gabsocial/actions/auth';
import { fetchMe } from 'gabsocial/actions/me';

export default @connect()
class LoginForm extends ImmutablePureComponent {

  state = {
    isLoading: false,
  }

  getFormData = (form) => {
    return Object.fromEntries(
      Array.from(form).map(i => [i.name, i.value])
    );
  }

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    const { username, password } = this.getFormData(event.target);
    dispatch(logIn(username, password)).then(() => {
      return dispatch(fetchMe());
    }).catch(error => {
      this.setState({ isLoading: false });
    });
    this.setState({ isLoading: true });
    event.preventDefault();
  }

  render() {
    return (
      <form className='simple_form new_user' onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.isLoading}>
          <div className='fields-group'>
            <div className='input email optional user_email'>
              <input aria-label='Username' className='string email optional' placeholder='Username' type='text' name='username' />
            </div>
            <div className='input password optional user_password'>
              <input aria-label='Password' className='password optional' placeholder='Password' type='password' name='password' />
            </div>
            <p className='hint subtle-hint'>
              <Link to='/auth/reset_password'>Trouble logging in?</Link>
            </p>
          </div>
        </fieldset>
        <div className='actions'>
          <button name='button' type='submit' className='btn button button-primary'>Log in</button>
        </div>
      </form>
    );
  }

}
