import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import ImmutablePureComponent from 'react-immutable-pure-component';

const messages = defineMessages({
  username: { id: 'login.fields.username_placeholder', defaultMessage: 'Username' },
  password: { id: 'login.fields.password_placeholder', defaultMessage: 'Password' },
});

export default @connect()
@injectIntl
class LoginForm extends ImmutablePureComponent {

  render() {
    const { intl, isLoading, handleSubmit } = this.props;

    return (
      <form className='simple_form new_user' method='post' onSubmit={handleSubmit}>
        <fieldset disabled={isLoading}>
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
