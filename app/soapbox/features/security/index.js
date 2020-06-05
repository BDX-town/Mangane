import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/column';
import {
  SimpleForm,
  SimpleInput,
  FieldsGroup,
  TextInput,
} from 'soapbox/features/forms';
import { changeEmail, changePassword } from 'soapbox/actions/auth';
import { showAlert } from 'soapbox/actions/alerts';

const messages = defineMessages({
  heading: { id: 'column.security', defaultMessage: 'Security' },
  submit: { id: 'security.submit', defaultMessage: 'Save changes' },
  updateEmailSuccess: { id: 'security.update_email.success', defaultMessage: 'Email successfully updated.' },
  updateEmailFail: { id: 'security.update_email.fail', defaultMessage: 'Update email failed.' },
  updatePasswordSuccess: { id: 'security.update_password.success', defaultMessage: 'Password successfully updated.' },
  updatePasswordFail: { id: 'security.update_password.fail', defaultMessage: 'Update password failed.' },
  emailFieldLabel: { id: 'security.fields.email.label', defaultMessage: 'Email address' },
  passwordFieldLabel: { id: 'security.fields.password.label', defaultMessage: 'Password' },
  oldPasswordFieldLabel: { id: 'security.fields.old_password.label', defaultMessage: 'Current password' },
  newPasswordFieldLabel: { id: 'security.fields.new_password.label', defaultMessage: 'New password' },
  confirmationFieldLabel: { id: 'security.fields.password_confirmation.label', defaultMessage: 'New password (again)' },
});

export default @injectIntl
class SecurityForm extends ImmutablePureComponent {

  render() {
    const { intl } = this.props;

    return (
      <Column icon='lock' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ChangeEmailForm />
        <ChangePasswordForm />
      </Column>
    );
  }

}

@connect()
@injectIntl
class ChangeEmailForm extends ImmutablePureComponent {

  static propTypes = {
    email: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    email: '',
    password: '',
    isLoading: false,
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    const { email, password } = this.state;
    const { dispatch, intl } = this.props;
    this.setState({ isLoading: true });
    return dispatch(changeEmail(email, password)).then(() => {
      this.setState({ email: '', password: '' }); // TODO: Maybe redirect user
      dispatch(showAlert('', intl.formatMessage(messages.updateEmailSuccess)));
    }).catch(error => {
      this.setState({ password: '' });
      dispatch(showAlert('', intl.formatMessage(messages.updateEmailFail)));
    }).then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <SimpleForm onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.isLoading}>
          <FieldsGroup>
            <TextInput
              label={intl.formatMessage(messages.emailFieldLabel)}
              placeholder='me@example.com'
              name='email'
              onChange={this.handleInputChange}
              value={this.state.email}
            />
            <SimpleInput
              type='password'
              label={intl.formatMessage(messages.passwordFieldLabel)}
              name='password'
              onChange={this.handleInputChange}
              value={this.state.password}
            />
            <div className='actions'>
              <button name='button' type='submit' className='btn button button-primary'>
                {intl.formatMessage(messages.submit)}
              </button>
            </div>
          </FieldsGroup>
        </fieldset>
      </SimpleForm>
    );
  }

}

@connect()
@injectIntl
class ChangePasswordForm extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    oldPassword: '',
    newPassword: '',
    confirmation: '',
    isLoading: false,
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  clearForm = () => {
    this.setState({ oldPassword: '', newPassword: '', confirmation: '' });
  }

  handleSubmit = e => {
    const { oldPassword, newPassword, confirmation } = this.state;
    const { dispatch, intl } = this.props;
    this.setState({ isLoading: true });
    return dispatch(changePassword(oldPassword, newPassword, confirmation)).then(() => {
      this.clearForm(); // TODO: Maybe redirect user
      dispatch(showAlert('', intl.formatMessage(messages.updatePasswordSuccess)));
    }).catch(error => {
      this.clearForm();
      dispatch(showAlert('', intl.formatMessage(messages.updatePasswordFail)));
    }).then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <SimpleForm onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.isLoading}>
          <FieldsGroup>
            <SimpleInput
              type='password'
              label={intl.formatMessage(messages.oldPasswordFieldLabel)}
              name='oldPassword'
              onChange={this.handleInputChange}
              value={this.state.oldPassword}
            />
            <SimpleInput
              type='password'
              label={intl.formatMessage(messages.newPasswordFieldLabel)}
              name='newPassword'
              onChange={this.handleInputChange}
              value={this.state.newPassword}
            />
            <SimpleInput
              type='password'
              label={intl.formatMessage(messages.confirmationFieldLabel)}
              name='confirmation'
              onChange={this.handleInputChange}
              value={this.state.confirmation}
            />
            <div className='actions'>
              <button name='button' type='submit' className='btn button button-primary'>
                {intl.formatMessage(messages.submit)}
              </button>
            </div>
          </FieldsGroup>
        </fieldset>
      </SimpleForm>
    );
  }

}
