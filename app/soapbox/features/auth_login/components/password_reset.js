import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { resetPassword } from 'soapbox/actions/security';
import { SimpleForm, FieldsGroup, TextInput } from 'soapbox/features/forms';
import { Redirect } from 'react-router-dom';
import snackbar from 'soapbox/actions/snackbar';

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
      <SimpleForm onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.isLoading}>
          <FieldsGroup>
            <TextInput
              name='nickname_or_email'
              label={intl.formatMessage(messages.nicknameOrEmail)}
              placeholder='me@example.com'
              required
            />
          </FieldsGroup>
        </fieldset>
        <div className='actions'>
          <button name='button' type='submit' className='btn button button-primary'>
            <FormattedMessage id='password_reset.reset' defaultMessage='Reset password' />
          </button>
        </div>
      </SimpleForm>
    );
  }

}
