import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import { CancelToken } from 'axios';
import { debounce } from 'lodash';
import { Map as ImmutableMap } from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import ShowablePassword from 'soapbox/components/showable_password';
import {
  SimpleForm,
  SimpleInput,
  TextInput,
  SimpleTextarea,
  Checkbox,
} from 'soapbox/features/forms';
import { register, verifyCredentials } from 'soapbox/actions/auth';
import CaptchaField from 'soapbox/features/auth_login/components/captcha';
import { getSettings } from 'soapbox/actions/settings';
import { openModal } from 'soapbox/actions/modal';
import { getFeatures } from 'soapbox/utils/features';
import { accountLookup } from 'soapbox/actions/accounts';

const messages = defineMessages({
  username: { id: 'registration.fields.username_placeholder', defaultMessage: 'Username' },
  username_hint: { id: 'registration.fields.username_hint', defaultMessage: 'Only letters, numbers, and underscores are allowed.' },
  email: { id: 'registration.fields.email_placeholder', defaultMessage: 'E-Mail address' },
  password: { id: 'registration.fields.password_placeholder', defaultMessage: 'Password' },
  confirm: { id: 'registration.fields.confirm_placeholder', defaultMessage: 'Password (again)' },
  agreement: { id: 'registration.agreement', defaultMessage: 'I agree to the {tos}.' },
  tos: { id: 'registration.tos', defaultMessage: 'Terms of Service' },
  close: { id: 'registration.confirmation_modal.close', defaultMessage: 'Close' },
  newsletter: { id: 'registration.newsletter', defaultMessage: 'Subscribe to newsletter.' },
  needsConfirmationHeader: { id: 'confirmations.register.needs_confirmation.header', defaultMessage: 'Confirmation needed' },
  needsApprovalHeader: { id: 'confirmations.register.needs_approval.header', defaultMessage: 'Approval needed' },
});

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  locale: getSettings(state).get('locale'),
  needsConfirmation: state.getIn(['instance', 'pleroma', 'metadata', 'account_activation_required']),
  needsApproval: state.getIn(['instance', 'approval_required']),
  supportsEmailList: getFeatures(state.get('instance')).emailList,
  supportsAccountLookup: getFeatures(state.get('instance')).accountLookup,
});

export default @connect(mapStateToProps)
@injectIntl
class RegistrationForm extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    instance: ImmutablePropTypes.map,
    locale: PropTypes.string,
    needsConfirmation: PropTypes.bool,
    needsApproval: PropTypes.bool,
    supportsEmailList: PropTypes.bool,
    supportsAccountLookup: PropTypes.bool,
    inviteToken: PropTypes.string,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  state = {
    captchaLoading: true,
    submissionLoading: false,
    params: ImmutableMap(),
    captchaIdempotencyKey: uuidv4(),
    usernameUnavailable: false,
    passwordConfirmation: '',
    passwordMismatch: false,
  }

  source = CancelToken.source();

  refreshCancelToken = () => {
    this.source.cancel();
    this.source = CancelToken.source();
    return this.source;
  }

  setParams = map => {
    this.setState({ params: this.state.params.merge(ImmutableMap(map)) });
  }

  onInputChange = e => {
    this.setParams({ [e.target.name]: e.target.value });
  }

  onUsernameChange = e => {
    this.setParams({ username: e.target.value });
    this.setState({ usernameUnavailable: false });
    this.source.cancel();

    this.usernameAvailable(e.target.value);
  }

  onCheckboxChange = e => {
    this.setParams({ [e.target.name]: e.target.checked });
  }

  onPasswordChange = e => {
    const password = e.target.value;
    const { passwordConfirmation } = this.state;
    this.onInputChange(e);

    if (password === passwordConfirmation) {
      this.setState({ passwordMismatch: false });
    }
  }

  onPasswordConfirmChange = e => {
    const password = this.state.params.get('password', '');
    const passwordConfirmation = e.target.value;
    this.setState({ passwordConfirmation });

    if (password === passwordConfirmation) {
      this.setState({ passwordMismatch: false });
    }
  }

  onPasswordConfirmBlur = e => {
    this.setState({ passwordMismatch: !this.passwordsMatch() });
  }

  launchModal = () => {
    const { dispatch, intl, needsConfirmation, needsApproval } = this.props;

    const message = (<>
      {needsConfirmation && <p>
        <FormattedMessage
          id='confirmations.register.needs_confirmation'
          defaultMessage='Please check your inbox at {email} for confirmation instructions. You will need to verify your email address to continue.'
          values={{ email: <strong>{this.state.params.get('email')}</strong> }}
        /></p>}
      {needsApproval && <p>
        <FormattedMessage
          id='confirmations.register.needs_approval'
          defaultMessage='Your account will be manually approved by an admin. Please be patient while we review your details.'
        /></p>}
    </>);

    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/icons/check.svg'),
      heading: needsConfirmation
        ? intl.formatMessage(messages.needsConfirmationHeader)
        : needsApproval
          ? intl.formatMessage(messages.needsApprovalHeader)
          : undefined,
      message,
      confirm: intl.formatMessage(messages.close),
    }));
  }

  postRegisterAction = ({ access_token }) => {
    const { dispatch, needsConfirmation, needsApproval } = this.props;
    const { router } = this.context;

    if (needsConfirmation || needsApproval) {
      return this.launchModal();
    } else {
      return dispatch(verifyCredentials(access_token)).then(() => {
        router.history.push('/');
      });
    }
  }

  passwordsMatch = () => {
    const { params, passwordConfirmation } = this.state;
    return params.get('password', '') === passwordConfirmation;
  }

  usernameAvailable = debounce(username => {
    const { dispatch, supportsAccountLookup } = this.props;

    if (!supportsAccountLookup) return;

    const source = this.refreshCancelToken();

    dispatch(accountLookup(username, source.token))
      .then(account => {
        this.setState({ usernameUnavailable: !!account });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          this.setState({ usernameUnavailable: false });
        }
      });

  }, 1000, { trailing: true });

  onSubmit = e => {
    const { dispatch, inviteToken } = this.props;

    if (!this.passwordsMatch()) {
      this.setState({ passwordMismatch: true });
      return;
    }

    const params = this.state.params.withMutations(params => {
      // Locale for confirmation email
      params.set('locale', this.props.locale);

      // Pleroma invites
      if (inviteToken) {
        params.set('token', inviteToken);
      }
    });

    this.setState({ submissionLoading: true });

    dispatch(register(params.toJS()))
      .then(this.postRegisterAction)
      .catch(error => {
        this.setState({ submissionLoading: false });
        this.refreshCaptcha();
      });
  }

  onCaptchaClick = e => {
    this.refreshCaptcha();
  }

  onFetchCaptcha = captcha => {
    this.setState({ captchaLoading: false });
    this.setParams({
      captcha_token: captcha.get('token'),
      captcha_answer_data: captcha.get('answer_data'),
    });
  }

  onFetchCaptchaFail = error => {
    this.setState({ captchaLoading: false });
  }

  refreshCaptcha = () => {
    this.setState({ captchaIdempotencyKey: uuidv4() });
    this.setParams({ captcha_solution: '' });
  }

  render() {
    const { instance, intl, supportsEmailList } = this.props;
    const { params, usernameUnavailable, passwordConfirmation, passwordMismatch } = this.state;
    const isLoading = this.state.captchaLoading || this.state.submissionLoading;

    return (
      <SimpleForm onSubmit={this.onSubmit}>
        <fieldset disabled={isLoading}>
          <div className='simple_form__overlay-area'>
            <div className='fields-group'>
              {usernameUnavailable && (
                <div className='error'>
                  <FormattedMessage id='registration.username_unavailable' defaultMessage='Username is already taken.' />
                </div>
              )}
              <TextInput
                placeholder={intl.formatMessage(messages.username)}
                name='username'
                hint={intl.formatMessage(messages.username_hint)}
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                pattern='^[a-zA-Z\d_-]+'
                onChange={this.onUsernameChange}
                value={params.get('username', '')}
                error={usernameUnavailable}
                required
              />
              <SimpleInput
                placeholder={intl.formatMessage(messages.email)}
                name='email'
                type='email'
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                onChange={this.onInputChange}
                value={params.get('email', '')}
                required
              />
              {passwordMismatch && (
                <div className='error'>
                  <FormattedMessage id='registration.password_mismatch' defaultMessage="Passwords don't match." />
                </div>
              )}
              <ShowablePassword
                placeholder={intl.formatMessage(messages.password)}
                name='password'
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                onChange={this.onPasswordChange}
                value={params.get('password', '')}
                error={passwordMismatch === true}
                required
              />
              <ShowablePassword
                placeholder={intl.formatMessage(messages.confirm)}
                name='password_confirmation'
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                onChange={this.onPasswordConfirmChange}
                onBlur={this.onPasswordConfirmBlur}
                value={passwordConfirmation}
                error={passwordMismatch === true}
                required
              />
              {instance.get('approval_required') &&
                <SimpleTextarea
                  label={<FormattedMessage id='registration.reason' defaultMessage='Why do you want to join?' />}
                  hint={<FormattedMessage id='registration.reason_hint' defaultMessage='This will help us review your application' />}
                  name='reason'
                  maxLength={500}
                  onChange={this.onInputChange}
                  value={params.get('reason', '')}
                  required
                />}
            </div>
            <CaptchaField
              onFetch={this.onFetchCaptcha}
              onFetchFail={this.onFetchCaptchaFail}
              onChange={this.onInputChange}
              onClick={this.onCaptchaClick}
              idempotencyKey={this.state.captchaIdempotencyKey}
              name='captcha_solution'
              value={params.get('captcha_solution', '')}
            />
            <div className='fields-group'>
              <Checkbox
                label={intl.formatMessage(messages.agreement, { tos: <Link to='/about/tos' target='_blank' key={0}>{intl.formatMessage(messages.tos)}</Link> })}
                name='agreement'
                onChange={this.onCheckboxChange}
                checked={params.get('agreement', false)}
                required
              />
              {supportsEmailList && <Checkbox
                label={intl.formatMessage(messages.newsletter)}
                name='accepts_email_list'
                onChange={this.onCheckboxChange}
                checked={params.get('accepts_email_list', false)}
              />}
            </div>
            <div className='actions'>
              <button name='button' type='submit' className='btn button button-primary'>
                <FormattedMessage id='registration.sign_up' defaultMessage='Sign up' />
              </button>
            </div>
          </div>
        </fieldset>
      </SimpleForm>
    );
  }

}
