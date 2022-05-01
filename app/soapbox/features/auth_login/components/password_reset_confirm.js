import PropTypes from 'prop-types';
import * as React from 'react';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { resetPasswordConfirm } from 'soapbox/actions/security';
import { Button, Form, FormActions, FormGroup, Input } from 'soapbox/components/ui';

const token = new URLSearchParams(window.location.search).get('reset_password_token');

const Statuses = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

const mapDispatchToProps = dispatch => ({
  resetPasswordConfirm: (password, token) => dispatch(resetPasswordConfirm(password, token)),
});

const PasswordResetConfirm = ({ resetPasswordConfirm }) => {
  const intl = useIntl();

  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState(Statuses.IDLE);

  const isLoading = status === Statuses.LOADING;

  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();

    setStatus(Statuses.LOADING);
    resetPasswordConfirm(password, token)
      .then(() => setStatus(Statuses.SUCCESS))
      .catch(() => setStatus(Statuses.FAIL));
  }, [resetPasswordConfirm, password]);

  const onChange = React.useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  const renderErrors = () => {
    if (status === Statuses.FAIL) {
      return [intl.formatMessage({ id: 'reset_password.fail', defaultMessage: 'Expired token, please try again.' })];
    }

    return [];
  };

  if (status === Statuses.SUCCESS) {
    return <Redirect to='/' />;
  }

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>
          <FormattedMessage id='reset_password.header' defaultMessage='Set New Password' />
        </h1>
      </div>

      <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Form onSubmit={handleSubmit}>
          <FormGroup labelText='Password' errors={renderErrors()}>
            <Input
              type='password'
              name='password'
              placeholder='Password'
              onChange={onChange}
              required
            />
          </FormGroup>

          <FormActions>
            <Button type='submit' theme='primary' disabled={isLoading}>
              <FormattedMessage id='password_reset.reset' defaultMessage='Reset password' />
            </Button>
          </FormActions>
        </Form>
      </div>
    </div>
  );
};

PasswordResetConfirm.propTypes = {
  resetPasswordConfirm: PropTypes.func,
};

export default injectIntl(connect(null, mapDispatchToProps)(PasswordResetConfirm));
