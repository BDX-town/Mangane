import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  SimpleForm,
  SimpleInput,
  TextInput,
  SimpleTextarea,
  Checkbox,
} from 'soapbox/features/forms';
import { register } from 'soapbox/actions/auth';
import CaptchaField from 'soapbox/features/auth_login/components/captcha';
import { Map as ImmutableMap } from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from 'soapbox/actions/settings';

const messages = defineMessages({
  username: { id: 'registration.fields.username_placeholder', defaultMessage: 'Username' },
  username_hint: { id: 'registration.fields.username_hint', defaultMessage: 'Only letters, numbers, and underscores are allowed, and Usernames are permanent.' },
  email: { id: 'registration.fields.email_placeholder', defaultMessage: 'E-Mail address' },
  password: { id: 'registration.fields.password_placeholder', defaultMessage: 'Password' },
  confirm: { id: 'registration.fields.confirm_placeholder', defaultMessage: 'Password (again)' },
  agreement: { id: 'registration.agreement', defaultMessage: 'I agree to the {tos}.' },
  tos: { id: 'registration.tos', defaultMessage: 'Terms of Service' },
});

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  locale: getSettings(state).get('locale'),
});

export default @connect(mapStateToProps)
@injectIntl
class RegistrationForm extends ImmutablePureComponent {

  static propTypes = {
    instance: ImmutablePropTypes.map,
    locale: PropTypes.string,
    intl: PropTypes.object.isRequired,
  }

  state = {
    captchaLoading: true,
    submissionLoading: false,
    params: ImmutableMap(),
    captchaIdempotencyKey: uuidv4(),
  }

  setParams = map => {
    this.setState({ params: this.state.params.merge(ImmutableMap(map)) });
  }

  onInputChange = e => {
    this.setParams({ [e.target.name]: e.target.value });
  }

  onCheckboxChange = e => {
    this.setParams({ [e.target.name]: e.target.checked });
  }

  onSubmit = e => {
    const params = this.state.params.set('locale', this.props.locale);
    this.setState({ submissionLoading: true });
    this.props.dispatch(register(params.toJS())).catch(error => {
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
  }

  render() {
    const { instance, intl } = this.props;
    const isOpen = instance.get('registrations');
    const isLoading = this.state.captchaLoading || this.state.submissionLoading;

    if (isOpen === false) {
      return (
        <div className='registrations-closed'>
          <h2>
            <FormattedMessage
              id='registration.closed_title'
              defaultMessage='Registrations Closed'
            />
          </h2>
          <div className='registrations-closed__message'>
            <FormattedMessage
              id='registration.closed_message'
              defaultMessage='{instance} is not accepting new members'
              values={{ instance: <strong>{instance.get('title')}</strong> }}
            />
          </div>
        </div>
      );
    }

    return (
      <SimpleForm onSubmit={this.onSubmit}>
        <fieldset disabled={isLoading || !isOpen}>
          <div className='simple_form__overlay-area'>
            <p className='lead'>
              <FormattedMessage
                id='registration.lead'
                defaultMessage="With an account on {instance} you'll be able to follow people on any server in the fediverse."
                values={{ instance: <strong>{instance.get('title')}</strong> }}
              />
            </p>
            <div className='fields-group'>
              <TextInput
                placeholder={intl.formatMessage(messages.username)}
                name='username'
                hint={intl.formatMessage(messages.username_hint)}
                autoComplete='off'
                pattern='^[a-zA-Z\d_-]+'
                onChange={this.onInputChange}
                required
              />
              <SimpleInput
                placeholder={intl.formatMessage(messages.email)}
                name='email'
                type='email'
                autoComplete='off'
                onChange={this.onInputChange}
                required
              />
              <SimpleInput
                placeholder={intl.formatMessage(messages.password)}
                name='password'
                type='password'
                autoComplete='off'
                onChange={this.onInputChange}
                required
              />
              <SimpleInput
                placeholder={intl.formatMessage(messages.confirm)}
                name='confirm'
                type='password'
                autoComplete='off'
                onChange={this.onInputChange}
                required
              />
              {instance.get('approval_required') &&
                <SimpleTextarea
                  label={<FormattedMessage id='registration.reason' defaultMessage='Why do you want to join?' />}
                  hint={<FormattedMessage id='registration.reason_hint' defaultMessage='This will help us review your application' />}
                  name='reason'
                  maxLength={500}
                  autoComplete='off'
                  onChange={this.onInputChange}
                  required
                />}
            </div>
            <CaptchaField
              onFetch={this.onFetchCaptcha}
              onFetchFail={this.onFetchCaptchaFail}
              onChange={this.onInputChange}
              onClick={this.onCaptchaClick}
              idempotencyKey={this.state.captchaIdempotencyKey}
            />
            <div className='fields-group'>
              <Checkbox
                label={intl.formatMessage(messages.agreement, { tos: <Link to='/about/tos' target='_blank' key={0}>{intl.formatMessage(messages.tos)}</Link> })}
                name='agreement'
                onChange={this.onCheckboxChange}
                required
              />
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
