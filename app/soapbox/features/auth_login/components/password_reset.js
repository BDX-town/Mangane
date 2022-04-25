import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { resetPassword } from 'soapbox/actions/security';
import snackbar from 'soapbox/actions/snackbar';

import { Button, Form, FormActions, FormGroup, Input } from '../../../components/ui';

const messages = defineMessages({
  nicknameOrEmail: { id: 'password_reset.fields.username_placeholder', defaultMessage: 'Email or username' },
  confirmation: { id: 'password_reset.confirmation', defaultMessage: 'Check your email for confirmation.' },
});

export default @connect()
@injectIntl
class PasswordReset extends ImmutablePureComponent {

  state = {
    isLoading: false,
    success: false,
  }

  handleSubmit = e => {
    const { dispatch, intl } = this.props;
    const nicknameOrEmail = e.target.nickname_or_email.value;
    this.setState({ isLoading: true });
    dispatch(resetPassword(nicknameOrEmail)).then(() => {
      this.setState({ isLoading: false, success: true });
      dispatch(snackbar.info(intl.formatMessage(messages.confirmation)));
    }).catch(error => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { intl } = this.props;

    if (this.state.success) return <Redirect to='/' />;

    return (
      <div>
        <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-600 border-solid -mx-4 sm:-mx-10'>
          <h1 className='text-center font-bold text-2xl'>
            {intl.formatMessage({ id: 'password_reset.header', defaultMessage: 'Reset Password' })}
          </h1>
        </div>

        <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup labelText={intl.formatMessage(messages.nicknameOrEmail)}>
              <Input
                name='nickname_or_email'
                placeholder='me@example.com'
                required
              />
            </FormGroup>

            <FormActions>
              <Button type='submit' theme='primary' disabled={this.state.isLoading}>
                <FormattedMessage id='password_reset.reset' defaultMessage='Reset password' />
              </Button>
            </FormActions>
          </Form>
        </div>
      </div>
    );
  }

}
