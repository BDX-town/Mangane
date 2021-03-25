import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Button from '../../../components/button';
import { SimpleForm, FieldsGroup, Checkbox } from 'soapbox/features/forms';

const messages = defineMessages({
  username: { id: 'login.fields.username_placeholder', defaultMessage: 'Username' },
  password: { id: 'login.fields.password_placeholder', defaultMessage: 'Password' },
});

export default @connect()
@injectIntl
class LoginModal extends ImmutablePureComponent {

  render() {
    const { intl, isLoading, handleSubmit } = this.props;

    return (
      <div className='modal-root__modal login-modal'>
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
      </div>
    );
  }

}
