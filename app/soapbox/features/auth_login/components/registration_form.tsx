import axios from 'axios';
import { Map as ImmutableMap } from 'immutable';
import { debounce } from 'lodash';
import React, { useState, useRef, useCallback } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { accountLookup } from 'soapbox/actions/accounts';
import { register, verifyCredentials } from 'soapbox/actions/auth';
import { openModal } from 'soapbox/actions/modals';
import BirthdayInput from 'soapbox/components/birthday_input';
import { Checkbox, Form, FormGroup, FormActions, Button, Input, Textarea } from 'soapbox/components/ui';
import CaptchaField from 'soapbox/features/auth_login/components/captcha';
import { useAppSelector, useAppDispatch, useSettings, useFeatures } from 'soapbox/hooks';

const messages = defineMessages({
  username: { id: 'registration.fields.username_placeholder', defaultMessage: 'Username' },
  username_hint: { id: 'registration.fields.username_hint', defaultMessage: 'Only letters, numbers, and underscores are allowed.' },
  usernameUnavailable: { id: 'registration.username_unavailable', defaultMessage: 'Username is already taken.' },
  email: { id: 'registration.fields.email_placeholder', defaultMessage: 'E-Mail address' },
  password: { id: 'registration.fields.password_placeholder', defaultMessage: 'Password' },
  passwordMismatch: { id: 'registration.password_mismatch', defaultMessage: 'Passwords don\'t match.' },
  confirm: { id: 'registration.fields.confirm_placeholder', defaultMessage: 'Password (again)' },
  agreement: { id: 'registration.agreement', defaultMessage: 'I agree to the {tos}.' },
  tos: { id: 'registration.tos', defaultMessage: 'Terms of Service' },
  close: { id: 'registration.confirmation_modal.close', defaultMessage: 'Close' },
  newsletter: { id: 'registration.newsletter', defaultMessage: 'Subscribe to newsletter.' },
  needsConfirmationHeader: { id: 'confirmations.register.needs_confirmation.header', defaultMessage: 'Confirmation needed' },
  needsApprovalHeader: { id: 'confirmations.register.needs_approval.header', defaultMessage: 'Approval needed' },
});

interface IRegistrationForm {
  inviteToken?: string,
}

/** Allows the user to sign up for the website. */
const RegistrationForm: React.FC<IRegistrationForm> = ({ inviteToken }) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const settings = useSettings();
  const features = useFeatures();
  const instance = useAppSelector(state => state.instance);

  const locale = settings.get('locale');
  const needsConfirmation = !!instance.pleroma.getIn(['metadata', 'account_activation_required']);
  const needsApproval = instance.approval_required;
  const supportsEmailList = features.emailList;
  const supportsAccountLookup = features.accountLookup;
  const birthdayRequired = instance.pleroma.getIn(['metadata', 'birthday_required']);

  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [params, setParams] = useState(ImmutableMap<string, any>());
  const [captchaIdempotencyKey, setCaptchaIdempotencyKey] = useState(uuidv4());
  const [usernameUnavailable, setUsernameUnavailable] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);

  const source = useRef(axios.CancelToken.source());

  const refreshCancelToken = () => {
    source.current.cancel();
    source.current = axios.CancelToken.source();
    return source.current;
  };

  const updateParams = (map: any) => {
    setParams(params.merge(ImmutableMap(map)));
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
    updateParams({ [e.target.name]: e.target.value });
  };

  const onUsernameChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    updateParams({ username: e.target.value });
    setUsernameUnavailable(false);
    source.current.cancel();

    usernameAvailable(e.target.value);
  };

  const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    updateParams({ [e.target.name]: e.target.checked });
  };

  const onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const password = e.target.value;
    onInputChange(e);

    if (password === passwordConfirmation) {
      setPasswordMismatch(false);
    }
  };

  const onPasswordConfirmChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const password = params.get('password', '');
    const passwordConfirmation = e.target.value;
    setPasswordConfirmation(passwordConfirmation);

    if (password === passwordConfirmation) {
      setPasswordMismatch(false);
    }
  };

  const onPasswordConfirmBlur: React.ChangeEventHandler<HTMLInputElement> = () => {
    setPasswordMismatch(!passwordsMatch());
  };

  const onBirthdayChange = (newBirthday: Date) => {
    setBirthday(newBirthday);
  };

  const launchModal = () => {
    const message = (<>
      {needsConfirmation && <p>
        <FormattedMessage
          id='confirmations.register.needs_confirmation'
          defaultMessage='Please check your inbox at {email} for confirmation instructions. You will need to verify your email address to continue.'
          values={{ email: <strong>{params.get('email')}</strong> }}
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
  };

  const postRegisterAction = ({ access_token }: any) => {
    if (needsConfirmation || needsApproval) {
      return launchModal();
    } else {
      return dispatch(verifyCredentials(access_token)).then(() => {
        history.push('/');
      });
    }
  };

  const passwordsMatch = () => {
    return params.get('password', '') === passwordConfirmation;
  };

  const usernameAvailable = useCallback(debounce(username => {
    if (!supportsAccountLookup) return;

    const source = refreshCancelToken();

    dispatch(accountLookup(username, source.token))
      .then(account => {
        setUsernameUnavailable(!!account);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setUsernameUnavailable(false);
        }
      });

  }, 1000, { trailing: true }), []);

  const onSubmit: React.FormEventHandler = () => {
    if (!passwordsMatch()) {
      setPasswordMismatch(true);
      return;
    }

    const normalParams = params.withMutations(params => {
      // Locale for confirmation email
      params.set('locale', locale);

      // Pleroma invites
      if (inviteToken) {
        params.set('token', inviteToken);
      }

      if (birthday) {
        params.set('birthday', new Date(birthday.getTime() - (birthday.getTimezoneOffset() * 60000)).toISOString().slice(0, 10));
      }
    });

    setSubmissionLoading(true);

    dispatch(register(normalParams.toJS()))
      .then(postRegisterAction)
      .catch(() => {
        setSubmissionLoading(false);
        refreshCaptcha();
      });
  };

  const onCaptchaClick: React.MouseEventHandler = () => {
    refreshCaptcha();
  };

  const onFetchCaptcha = (captcha: ImmutableMap<string, any>) => {
    setCaptchaLoading(false);
    updateParams({
      captcha_token: captcha.get('token'),
      captcha_answer_data: captcha.get('answer_data'),
    });
  };

  const onFetchCaptchaFail = () => {
    setCaptchaLoading(false);
  };

  const refreshCaptcha = () => {
    setCaptchaIdempotencyKey(uuidv4());
    updateParams({ captcha_solution: '' });
  };

  const isLoading = captchaLoading || submissionLoading;

  return (
    <Form onSubmit={onSubmit} data-testid='registrations-open'>
      <fieldset disabled={isLoading} className='space-y-3'>
        <FormGroup
          hintText={intl.formatMessage(messages.username_hint)}
          errors={usernameUnavailable ? [intl.formatMessage(messages.usernameUnavailable)] : undefined}
        >
          <Input
            type='text'
            name='username'
            placeholder={intl.formatMessage(messages.username)}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            pattern='^[a-zA-Z\d_-]+'
            onChange={onUsernameChange}
            value={params.get('username', '')}
            hasError={usernameUnavailable}
            required
          />
        </FormGroup>

        <Input
          type='email'
          name='email'
          placeholder={intl.formatMessage(messages.email)}
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          onChange={onInputChange}
          value={params.get('email', '')}
          required
        />

        <Input
          type='password'
          name='password'
          placeholder={intl.formatMessage(messages.password)}
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          onChange={onPasswordChange}
          value={params.get('password', '')}
          required
        />

        <FormGroup
          errors={passwordMismatch ? [intl.formatMessage(messages.passwordMismatch)] : undefined}
        >
          <Input
            type='password'
            name='password_confirmation'
            placeholder={intl.formatMessage(messages.confirm)}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            onChange={onPasswordConfirmChange}
            onBlur={onPasswordConfirmBlur}
            value={passwordConfirmation}
            required
          />
        </FormGroup>

        {birthdayRequired && (
          <BirthdayInput
            value={birthday}
            onChange={onBirthdayChange}
            required
          />
        )}

        {needsApproval && (
          <FormGroup
            labelText={<FormattedMessage id='registration.reason' defaultMessage='Why do you want to join?' />}
            hintText={<FormattedMessage id='registration.reason_hint' defaultMessage='This will help us review your application' />}
          >
            <Textarea
              name='reason'
              maxLength={500}
              onChange={onInputChange}
              value={params.get('reason', '')}
              required
            />
          </FormGroup>
        )}

        <CaptchaField
          onFetch={onFetchCaptcha}
          onFetchFail={onFetchCaptchaFail}
          onChange={onInputChange}
          onClick={onCaptchaClick}
          idempotencyKey={captchaIdempotencyKey}
          name='captcha_solution'
          value={params.get('captcha_solution', '')}
        />

        <FormGroup
          labelText={intl.formatMessage(messages.agreement, { tos: <Link to='/about/tos' target='_blank' key={0}>{intl.formatMessage(messages.tos)}</Link> })}
        >
          <Checkbox
            name='agreement'
            onChange={onCheckboxChange}
            checked={params.get('agreement', false)}
            required
          />
        </FormGroup>

        {supportsEmailList && (
          <FormGroup labelText={intl.formatMessage(messages.newsletter)}>
            <Checkbox
              name='accepts_email_list'
              onChange={onCheckboxChange}
              checked={params.get('accepts_email_list', false)}
            />
          </FormGroup>
        )}

        <FormActions>
          <Button type='submit'>
            <FormattedMessage id='registration.sign_up' defaultMessage='Sign up' />
          </Button>
        </FormActions>
      </fieldset>
    </Form>
  );
};

export default RegistrationForm;
