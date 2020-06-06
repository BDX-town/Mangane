import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { logIn } from 'soapbox/actions/auth';
import { fetchMe } from 'soapbox/actions/me';

const messages = defineMessages({
  username: { id: 'login.fields.username_placeholder', defaultMessage: 'Username' },
  password: { id: 'login.fields.password_placeholder', defaultMessage: 'Password' },
});

export default @connect()
@injectIntl
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
    const { intl } = this.props;

    return (
      <form className='simple_form new_user' onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.isLoading}>
          <div className='fields-group'>
            <div className='input email optional user_email'>
              <input aria-label={intl.formatMessage(messages.username)} className='string email optional' placeholder={intl.formatMessage(messages.username)} type='text' name='username' />
            </div>
            <div className='input password optional user_password'>
              <input aria-label={intl.formatMessage(messages.password)} className='password optional' placeholder={intl.formatMessage(messages.password)} type='password' name='password' />
            </div>
            <p className='hint subtle-hint'>
              <Link to='/auth/reset_password'>
                <FormattedMessage id='login.reset_password_hint' defaultMessage='Trouble logging in?' />
              </Link>
            </p>
          </div>
        </fieldset>
        <div className='actions'>
          <button name='button' type='submit' className='btn button button-primary'>
            <FormattedMessage id='login.log_in' defaultMessage='Log in' />
          </button>
        </div>
      </form>
    );
  }

}
