import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { getFeatures } from 'soapbox/utils/features';
import { getBaseURL } from 'soapbox/utils/state';

const messages = defineMessages({
  username: { id: 'login.fields.username_placeholder', defaultMessage: 'Username' },
  password: { id: 'login.fields.password_placeholder', defaultMessage: 'Password' },
});

const mapStateToProps = state => {
  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    baseURL: getBaseURL(state),
    hasResetPasswordAPI: features.resetPasswordAPI,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class LoginForm extends ImmutablePureComponent {

  render() {
    const { intl, isLoading, handleSubmit, baseURL, hasResetPasswordAPI } = this.props;

    return (
      <form className='simple_form new_user' method='post' onSubmit={handleSubmit}>
        <fieldset disabled={isLoading}>
          <div className='fields-group'>
            <div className='input email user_email'>
              <input
                aria-label={intl.formatMessage(messages.username)}
                className='string email'
                placeholder={intl.formatMessage(messages.username)}
                type='text'
                name='username'
                autoComplete='off'
                required
              />
            </div>
            <div className='input password user_password'>
              <input
                aria-label={intl.formatMessage(messages.password)}
                className='password'
                placeholder={intl.formatMessage(messages.password)}
                type='password'
                name='password'
                autoComplete='off'
                required
              />
            </div>
            <p className='hint subtle-hint'>
              {hasResetPasswordAPI ? (
                <Link to='/auth/reset_password'>
                  <FormattedMessage id='login.reset_password_hint' defaultMessage='Trouble logging in?' />
                </Link>
              ) : (
                <a href={`${baseURL}/auth/password/new`}>
                  <FormattedMessage id='login.reset_password_hint' defaultMessage='Trouble logging in?' />
                </a>
              )}
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
