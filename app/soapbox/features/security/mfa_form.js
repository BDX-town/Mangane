import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import snackbar from 'soapbox/actions/snackbar';
import Button from 'soapbox/components/button';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import ShowablePassword from 'soapbox/components/showable_password';
import {
  SimpleForm,
  FieldsGroup,
  TextInput,
} from 'soapbox/features/forms';

import {
  fetchMfa,
  fetchBackupCodes,
  setupMfa,
  confirmMfa,
  disableMfa,
} from '../../actions/mfa';
import Column from '../ui/components/column';
import ColumnSubheading from '../ui/components/column_subheading';

/*
Security settings page for user account
Routed to /auth/mfa
Includes following features:
- Set up Multi-factor Auth
*/

const messages = defineMessages({
  heading: { id: 'column.security', defaultMessage: 'Security' },
  subheading: { id: 'column.mfa', defaultMessage: 'Multi-Factor Authentication' },
  mfa_cancel_button: { id: 'column.mfa_cancel', defaultMessage: 'Cancel' },
  mfa_setup_button: { id: 'column.mfa_setup', defaultMessage: 'Proceed to Setup' },
  mfa_setup_confirm_button: { id: 'column.mfa_confirm_button', defaultMessage: 'Confirm' },
  mfa_setup_disable_button: { id: 'column.mfa_disable_button', defaultMessage: 'Disable' },
  passwordFieldLabel: { id: 'security.fields.password.label', defaultMessage: 'Password' },
  confirmFail: { id: 'security.confirm.fail', defaultMessage: 'Incorrect code or password. Try again.' },
  qrFail: { id: 'security.qr.fail', defaultMessage: 'Failed to fetch setup key' },
  codesFail: { id: 'security.codes.fail', defaultMessage: 'Failed to fetch backup codes' },
  disableFail: { id: 'security.disable.fail', defaultMessage: 'Incorrect password. Try again.' },
  mfaDisableSuccess: { id: 'mfa.disable.success_message', defaultMessage: 'MFA disabled' },
  mfaConfirmSuccess: { id: 'mfa.confirm.success_message', defaultMessage: 'MFA confirmed' },
  codePlaceholder: { id: 'mfa.mfa_setup.code_placeholder', defaultMessage: 'Code' },
  passwordPlaceholder: { id: 'mfa.mfa_setup.password_placeholder', defaultMessage: 'Password' },
});

const mapStateToProps = state => ({
  backup_codes: state.getIn(['auth', 'backup_codes', 'codes']),
  mfa: state.getIn(['security', 'mfa']),
});

export default @connect(mapStateToProps)
@injectIntl
@withRouter
class MfaForm extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    mfa: ImmutablePropTypes.map.isRequired,
    history: PropTypes.object,
  };

  state = {
    displayOtpForm: false,
  }

  handleSetupProceedClick = e => {
    this.setState({ displayOtpForm: true });
    e.preventDefault();
  }

  componentDidMount() {
    this.props.dispatch(fetchMfa());
  }

  render() {
    const { intl, mfa } = this.props;
    const { displayOtpForm } = this.state;

    return (
      <Column icon='lock' heading={intl.formatMessage(messages.heading)}>
        <ColumnSubheading text={intl.formatMessage(messages.subheading)} />
        {mfa.getIn(['settings', 'totp']) ? (
          <DisableOtpForm />
        ) : (
          <>
            <EnableOtpForm handleSetupProceedClick={this.handleSetupProceedClick} />
            {displayOtpForm && <OtpConfirmForm />}
          </>
        )}
      </Column>
    );
  }

}


@connect()
@injectIntl
@withRouter
class DisableOtpForm extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object,
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

    dispatch(disableMfa('totp', password)).then(() => {
      dispatch(snackbar.success(intl.formatMessage(messages.mfaDisableSuccess)));
      this.props.history.push('../auth/edit');
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.disableFail)));
      this.setState({ isLoading: false });
    });

    e.preventDefault();
  }

  render() {
    const { intl } = this.props;
    const { isLoading, password } = this.state;

    return (
      <div className='security-settings-panel'>
        <SimpleForm onSubmit={this.handleSubmit} disabled={isLoading}>
          <h1 className='security-settings-panel__setup-otp'>
            <FormattedMessage id='mfa.otp_enabled_title' defaultMessage='OTP Enabled' />
          </h1>
          <h2 className='security-settings-panel__setup-otp'>
            <FormattedMessage id='mfa.otp_enabled_description' defaultMessage='You have enabled two-factor authentication via OTP.' />
          </h2>
          <ShowablePassword
            label={intl.formatMessage(messages.passwordPlaceholder)}
            placeholder={intl.formatMessage(messages.passwordPlaceholder)}
            hint={<FormattedMessage id='mfa.mfa_disable_enter_password' defaultMessage='Enter your current password to disable two-factor auth.' />}
            disabled={isLoading}
            name='password'
            onChange={this.handleInputChange}
            value={password}
            required
          />
          <div className='security-settings-panel__setup-otp__buttons'>
            <Button
              disabled={isLoading}
              className='button button-primary disable'
              text={intl.formatMessage(messages.mfa_setup_disable_button)}
            />
          </div>
        </SimpleForm>
      </div>
    );
  }

}


@connect()
@injectIntl
@withRouter
class EnableOtpForm extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object,
  };

  state = {
    backupCodes: [],
  }

  componentDidMount() {
    const { dispatch, intl } = this.props;

    dispatch(fetchBackupCodes()).then(({ codes: backupCodes }) => {
      this.setState({ backupCodes });
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.codesFail)));
    });
  }

  handleCancelClick = e => {
    this.props.history.push('../auth/edit');
    e.preventDefault();
  }

  render() {
    const { intl } = this.props;
    const { backupCodes, displayOtpForm } = this.state;

    return (
      <div className='security-settings-panel'>
        <SimpleForm>
          <h1 className='security-settings-panel__setup-otp'>
            <FormattedMessage id='mfa.setup_otp_title' defaultMessage='OTP Disabled' />
          </h1>
          <h2 className='security-settings-panel__setup-otp'>
            <FormattedMessage id='mfa.setup_hint' defaultMessage='Follow these steps to set up multi-factor authentication on your account with OTP' />
          </h2>
          <div className='security-warning'>
            <FormattedMessage id='mfa.setup_warning' defaultMessage="Write these codes down or save them somewhere secure - otherwise you won't see them again. If you lose access to your 2FA app and recovery codes you'll be locked out of your account." />
          </div>
          <h2 className='security-settings-panel__setup-otp'>
            <FormattedMessage id='mfa.setup_recoverycodes' defaultMessage='Recovery codes' />
          </h2>
          <div className='backup_codes'>
            {backupCodes.length > 0 ? (
              <div>
                {backupCodes.map((code, i) => (
                  <div key={i} className='backup_code'>
                    <div className='backup_code'>{code}</div>
                  </div>
                ))}
              </div>
            ) : (
              <LoadingIndicator />
            )}
          </div>
          {!displayOtpForm && (
            <div className='security-settings-panel__setup-otp__buttons'>
              <Button className='button button-secondary cancel' text={intl.formatMessage(messages.mfa_cancel_button)} onClick={this.handleCancelClick} />
              {backupCodes.length > 0 && (
                <Button className='button button-primary setup' text={intl.formatMessage(messages.mfa_setup_button)} onClick={this.props.handleSetupProceedClick} />
              )}
            </div>
          )}
        </SimpleForm>
      </div>
    );
  }

}


@connect()
@injectIntl
@withRouter
class OtpConfirmForm extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    history: PropTypes.object,
  };

  state = {
    password: '',
    isLoading: false,
    code: '',
    qrCodeURI: '',
    confirm_key: '',
  }

  componentDidMount() {
    const { dispatch, intl } = this.props;

    dispatch(setupMfa('totp')).then(data => {
      this.setState({ qrCodeURI: data.provisioning_uri, confirm_key: data.key  });
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.qrFail)));
    });
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCancelClick = e => {
    this.props.history.push('../auth/edit');
    e.preventDefault();
  }

  handleSubmit = e => {
    const { dispatch, intl } = this.props;
    const { code, password } = this.state;

    this.setState({ isLoading: true });

    dispatch(confirmMfa('totp', code, password)).then(() => {
      dispatch(snackbar.success(intl.formatMessage(messages.mfaConfirmSuccess)));
      this.props.history.push('../auth/edit');
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.confirmFail)));
      this.setState({ isLoading: false });
    });

    e.preventDefault();
  }

  render() {
    const { intl } = this.props;
    const { isLoading, qrCodeURI, confirm_key, password, code } = this.state;

    return (
      <div className='security-settings-panel'>
        <SimpleForm onSubmit={this.handleSubmit} disabled={isLoading}>

          <fieldset disabled={false}>
            <FieldsGroup>
              <div className='security-settings-panel__section-container'>
                <h2><FormattedMessage id='mfa.mfa_setup_scan_title' defaultMessage='Scan' /></h2>

                <div><FormattedMessage id='mfa.mfa_setup_scan_description' defaultMessage='Using your two-factor app, scan this QR code or enter the text key.' /></div>

                <div className='security-settings-panel__qr-code'>
                  <QRCode value={qrCodeURI} />
                  <div className='security-settings-panel__confirm-key'>
                    {confirm_key}
                  </div>
                </div>

              </div>

              <div className='security-settings-panel__section-container'>
                <h2><FormattedMessage id='mfa.mfa_setup_verify_title' defaultMessage='Verify' /></h2>

                <TextInput
                  name='code'
                  label={intl.formatMessage(messages.codePlaceholder)}
                  hint={<FormattedMessage id='mfa.mfa_setup.code_hint' defaultMessage='Enter the code from your two-factor app.' />}
                  placeholder={intl.formatMessage(messages.codePlaceholder)}
                  onChange={this.handleInputChange}
                  autoComplete='off'
                  value={code}
                  disabled={isLoading}
                  required
                />
                <ShowablePassword
                  name='password'
                  label={intl.formatMessage(messages.passwordPlaceholder)}
                  hint={<FormattedMessage id='mfa.mfa_setup.password_hint' defaultMessage='Enter your current password to confirm your identity.' />}
                  placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                  onChange={this.handleInputChange}
                  value={password}
                  disabled={isLoading}
                  required
                />
              </div>
            </FieldsGroup>
          </fieldset>
          <div className='security-settings-panel__setup-otp__buttons'>
            <Button
              type='button'
              className='button button-secondary cancel'
              text={intl.formatMessage(messages.mfa_cancel_button)}
              onClick={this.handleCancelClick}
              disabled={isLoading}
            />
            <Button
              type='submit'
              className='button button-primary setup'
              text={intl.formatMessage(messages.mfa_setup_confirm_button)}
              disabled={isLoading}
            />
          </div>
        </SimpleForm>
      </div>
    );
  }

}
