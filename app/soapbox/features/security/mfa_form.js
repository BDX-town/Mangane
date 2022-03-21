import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import snackbar from 'soapbox/actions/snackbar';
import { Spinner } from 'soapbox/components/ui';

import {
  fetchMfa,
  fetchBackupCodes,
  setupMfa,
  confirmMfa,
  disableMfa,
} from '../../actions/mfa';
import { Button, Card, CardBody, CardHeader, CardTitle, Column, Form, FormActions, FormGroup, Input, Stack, Text } from '../../components/ui';

/*
Security settings page for user account
Routed to /auth/mfa
Includes following features:
- Set up Multi-factor Auth
*/

const messages = defineMessages({
  heading: { id: 'column.mfa', defaultMessage: 'Multi-Factor Authentication' },
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
      <Column label={intl.formatMessage(messages.heading)} transparent withHeader={false}>
        <Card variant='rounded'>
          <CardHeader backHref='/settings'>
            <CardTitle title={intl.formatMessage(messages.heading)} />
          </CardHeader>

          <CardBody>
            {mfa.getIn(['settings', 'totp']) ? (
              <DisableOtpForm />
            ) : (
              <>
                <EnableOtpForm displayOtpForm={displayOtpForm} handleSetupProceedClick={this.handleSetupProceedClick} />
                {displayOtpForm && <OtpConfirmForm />}
              </>
            )}
          </CardBody>
        </Card>
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
      <Form onSubmit={this.handleSubmit} disabled={isLoading}>
        <Stack>
          <Text weight='medium'>
            <FormattedMessage id='mfa.otp_enabled_title' defaultMessage='OTP Enabled' />
          </Text>

          <Text theme='muted'>
            <FormattedMessage id='mfa.otp_enabled_description' defaultMessage='You have enabled two-factor authentication via OTP.' />
          </Text>
        </Stack>

        <FormGroup
          labelText={intl.formatMessage(messages.passwordPlaceholder)}
          hintText={<FormattedMessage id='mfa.mfa_disable_enter_password' defaultMessage='Enter your current password to disable two-factor auth.' />}
        >
          <Input
            type='password'
            placeholder={intl.formatMessage(messages.passwordPlaceholder)}
            disabled={isLoading}
            name='password'
            onChange={this.handleInputChange}
            value={password}
            required
          />
        </FormGroup>

        <FormActions>
          <Button
            disabled={isLoading}
            theme='danger'
            text={intl.formatMessage(messages.mfa_setup_disable_button)}
          />
        </FormActions>
      </Form>
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
    const { intl, displayOtpForm } = this.props;
    const { backupCodes } = this.state;

    return (
      <Stack space={4}>
        {/* Removing for now -- seems redundant. */}
        {/* <p className='text-muted mb-10'>
          <FormattedMessage id='mfa.setup_hint' defaultMessage='Follow these steps to set up multi-factor authentication on your account with OTP.' />
        </p> */}
        <Stack space={2}>
          <Text theme='muted'>
            <FormattedMessage id='mfa.setup_warning' defaultMessage="Write these codes down or save them somewhere secure - otherwise you won't see them again. If you lose access to your 2FA app and recovery codes you'll be locked out of your account." />
          </Text>

          <div className='bg-gray-100 rounded-lg p-4'>
            <Stack space={3}>
              <Text weight='medium' align='center'>
                <FormattedMessage id='mfa.setup_recoverycodes' defaultMessage='Recovery codes' />
              </Text>

              {backupCodes.length > 0 ? (
                <div className='grid gap-3 grid-cols-2 rounded-lg text-center'>
                  {backupCodes.map((code, i) => (
                    <Text key={i} theme='muted' size='sm'>
                      {code}
                    </Text>
                  ))}
                </div>
              ) : (
                <Spinner />
              )}
            </Stack>
          </div>
        </Stack>

        {!displayOtpForm && (
          <FormActions>
            <Button
              theme='ghost'
              text={intl.formatMessage(messages.mfa_cancel_button)}
              onClick={this.handleCancelClick}
            />

            {backupCodes.length > 0 && (
              <Button
                theme='primary'
                text={intl.formatMessage(messages.mfa_setup_button)}
                onClick={this.props.handleSetupProceedClick}
              />
            )}
          </FormActions>
        )}
      </Stack>
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
      <Stack space={4}>
        <hr className='mt-4' />

        <Form onSubmit={this.handleSubmit} disabled={isLoading}>
          <Stack>
            <Text weight='semibold' size='lg'>
              1. <FormattedMessage id='mfa.mfa_setup_scan_title' defaultMessage='Scan' />
            </Text>

            <Text theme='muted'>
              <FormattedMessage id='mfa.mfa_setup_scan_description' defaultMessage='Using your two-factor app, scan this QR code or enter the text key.' />
            </Text>
          </Stack>

          <QRCode value={qrCodeURI} />
          {confirm_key}

          <Text weight='semibold' size='lg'>
            2. <FormattedMessage id='mfa.mfa_setup_verify_title' defaultMessage='Verify' />
          </Text>

          <FormGroup
            labelText={intl.formatMessage(messages.codePlaceholder)}
            hintText={<FormattedMessage id='mfa.mfa_setup.code_hint' defaultMessage='Enter the code from your two-factor app.' />}
          >
            <Input
              name='code'
              placeholder={intl.formatMessage(messages.codePlaceholder)}
              onChange={this.handleInputChange}
              autoComplete='off'
              value={code}
              disabled={isLoading}
              required
            />
          </FormGroup>

          <FormGroup
            labelText={intl.formatMessage(messages.passwordPlaceholder)}
            hintText={<FormattedMessage id='mfa.mfa_setup.password_hint' defaultMessage='Enter your current password to confirm your identity.' />}
          >
            <Input
              type='password'
              name='password'
              placeholder={intl.formatMessage(messages.passwordPlaceholder)}
              onChange={this.handleInputChange}
              value={password}
              disabled={isLoading}
              required
            />
          </FormGroup>

          <FormActions>
            <Button
              type='button'
              theme='ghost'
              text={intl.formatMessage(messages.mfa_cancel_button)}
              onClick={this.handleCancelClick}
              disabled={isLoading}
            />

            <Button
              type='submit'
              theme='primary'
              text={intl.formatMessage(messages.mfa_setup_confirm_button)}
              disabled={isLoading}
            />
          </FormActions>
        </Form>
      </Stack>
    );
  }

}
