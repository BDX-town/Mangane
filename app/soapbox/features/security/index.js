import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedDate } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import {
  SimpleForm,
  SimpleInput,
  FieldsGroup,
  TextInput,
} from 'soapbox/features/forms';
import {
  changeEmail,
  changePassword,
  fetchOAuthTokens,
  revokeOAuthToken,
  deleteAccount,
} from 'soapbox/actions/auth';
import { showAlert } from 'soapbox/actions/alerts';

/*
Security settings page for user account
Routed to /auth/edit
Includes following features:
- Change Email
- Change Password
- Sessions
- Deactivate Account
*/

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
  revoke: { id: 'security.tokens.revoke', defaultMessage: 'Revoke' },
  emailHeader: { id: 'security.headers.update_email', defaultMessage: 'Change Email' },
  passwordHeader: { id: 'security.headers.update_password', defaultMessage: 'Change Password' },
  tokenHeader: { id: 'security.headers.tokens', defaultMessage: 'Sessions' },
  deleteHeader: { id: 'security.headers.delete', defaultMessage: 'Delete Account' },
  deleteText: { id: 'security.text.delete', defaultMessage: 'To delete your account, enter your password then click Delete Account. This is a permanent action that cannot be undone. Your account will be destroyed from this server, and a deletion request will be sent to other servers. It\'s not guaranteed that all servers will purge your account.' },
  deleteSubmit: { id: 'security.submit.delete', defaultMessage: 'Delete Account' },
  deleteAccountSuccess: { id: 'security.delete_account.success', defaultMessage: 'Account successfully deleted.' },
  deleteAccountFail: { id: 'security.delete_account.fail', defaultMessage: 'Account deletion failed.' },
});

export default @injectIntl
class SecurityForm extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { intl } = this.props;

    return (
      <Column icon='lock' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ChangeEmailForm />
        <ChangePasswordForm />
        <AuthTokenList />
        <DeactivateAccount />
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
        <h2>{intl.formatMessage(messages.emailHeader)}</h2>
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
        <h2>{intl.formatMessage(messages.passwordHeader)}</h2>
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

const mapStateToProps = state => ({
  tokens: state.getIn(['auth', 'tokens']),
});

@connect(mapStateToProps)
@injectIntl
class AuthTokenList extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    tokens: ImmutablePropTypes.list,
  };

  handleRevoke = id => {
    return e => {
      this.props.dispatch(revokeOAuthToken(id));
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchOAuthTokens());
  }

  render() {
    const { tokens, intl } = this.props;
    if (tokens.isEmpty()) return null;
    return (
      <SimpleForm>
        <h2>{intl.formatMessage(messages.tokenHeader)}</h2>
        <div className='authtokens'>
          {tokens.reverse().map((token, i) => (
            <div key={i} className='authtoken'>
              <div className='authtoken__app-name'>{token.get('app_name')}</div>
              <div className='authtoken__valid-until'>
                <FormattedDate
                  value={new Date(token.get('valid_until'))}
                  hour12={false}
                  year='numeric'
                  month='short'
                  day='2-digit'
                  hour='2-digit'
                  minute='2-digit'
                />
              </div>
              <div className='authtoken__revoke'>
                <button onClick={this.handleRevoke(token.get('id'))}>
                  {this.props.intl.formatMessage(messages.revoke)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </SimpleForm>
    );
  }

}

@connect(mapStateToProps)
@injectIntl
class DeactivateAccount extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    password: '',
    isLoading: false,
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    const { password } = this.state;
    const { dispatch, intl } = this.props;
    this.setState({ isLoading: true });
    return dispatch(deleteAccount(password)).then(() => {
      //this.setState({ email: '', password: '' }); // TODO: Maybe redirect user
      dispatch(showAlert('', intl.formatMessage(messages.deleteAccountSuccess)));
    }).catch(error => {
      this.setState({ password: '' });
      dispatch(showAlert('', intl.formatMessage(messages.deleteAccountFail)));
    }).then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <SimpleForm onSubmit={this.handleSubmit}>
        <h2>{intl.formatMessage(messages.deleteHeader)}</h2>
        <p className='hint'>
          {intl.formatMessage(messages.deleteText)}
        </p>
        <fieldset disabled={this.state.isLoading}>
          <FieldsGroup>
            <SimpleInput
              type='password'
              label={intl.formatMessage(messages.passwordFieldLabel)}
              name='password'
              onChange={this.handleInputChange}
              value={this.state.password}
            />
            <div className='actions'>
              <button name='button' type='submit' className='btn button button-primary'>
                {intl.formatMessage(messages.deleteSubmit)}
              </button>
            </div>
          </FieldsGroup>
        </fieldset>
      </SimpleForm>
    );
  }

}
