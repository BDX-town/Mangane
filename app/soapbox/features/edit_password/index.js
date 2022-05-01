import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changePassword } from 'soapbox/actions/security';
import snackbar from 'soapbox/actions/snackbar';

import { Button, Card, CardBody, CardHeader, CardTitle, Column, Form, FormActions, FormGroup, Input } from '../../components/ui';

const messages = defineMessages({
  updatePasswordSuccess: { id: 'security.update_password.success', defaultMessage: 'Password successfully updated.' },
  updatePasswordFail: { id: 'security.update_password.fail', defaultMessage: 'Update password failed.' },
  oldPasswordFieldLabel: { id: 'security.fields.old_password.label', defaultMessage: 'Current password' },
  newPasswordFieldLabel: { id: 'security.fields.new_password.label', defaultMessage: 'New password' },
  confirmationFieldLabel: { id: 'security.fields.password_confirmation.label', defaultMessage: 'New password (again)' },
  header: { id: 'edit_password.header', defaultMessage: 'Change Password' },
  submit: { id: 'security.submit', defaultMessage: 'Save changes' },
  cancel: { id: 'common.cancel', defaultMessage: 'Cancel' },
});

const initialState = { currentPassword: '', newPassword: '', newPasswordConfirmation: '' };

const EditPassword = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [state, setState] = React.useState(initialState);
  const [isLoading, setLoading] = React.useState(false);

  const { currentPassword, newPassword, newPasswordConfirmation } = state;

  const resetState = () => setState(initialState);

  const handleInputChange = React.useCallback((event) => {
    event.persist();

    setState((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
  }, []);

  const handleSubmit = React.useCallback(() => {
    setLoading(true);
    dispatch(changePassword(currentPassword, newPassword, newPasswordConfirmation)).then(() => {
      resetState();
      dispatch(snackbar.success(intl.formatMessage(messages.updatePasswordSuccess)));

    }).finally(() => {
      setLoading(false);
    }).catch(() => {
      resetState();
      dispatch(snackbar.error(intl.formatMessage(messages.updatePasswordFail)));
    });
  }, [currentPassword, newPassword, newPasswordConfirmation, dispatch, intl]);

  return (
    <Column label={intl.formatMessage(messages.header)} transparent withHeader={false}>
      <Card variant='rounded'>
        <CardHeader backHref='/settings'>
          <CardTitle title={intl.formatMessage(messages.header)} />
        </CardHeader>

        <CardBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup labelText={intl.formatMessage(messages.oldPasswordFieldLabel)}>
              <Input
                type='password'
                name='currentPassword'
                onChange={handleInputChange}
                value={currentPassword}
              />
            </FormGroup>

            <FormGroup labelText={intl.formatMessage(messages.newPasswordFieldLabel)}>
              <Input
                type='password'
                name='newPassword'
                onChange={handleInputChange}
                value={newPassword}
              />
            </FormGroup>

            <FormGroup labelText={intl.formatMessage(messages.confirmationFieldLabel)}>
              <Input
                type='password'
                name='newPasswordConfirmation'
                onChange={handleInputChange}
                value={newPasswordConfirmation}
              />
            </FormGroup>

            <FormActions>
              <Button to='/settings' theme='ghost'>
                {intl.formatMessage(messages.cancel)}
              </Button>

              <Button type='submit' theme='primary' disabled={isLoading}>
                {intl.formatMessage(messages.submit)}
              </Button>
            </FormActions>
          </Form>
        </CardBody>
      </Card>
    </Column>
  );
};

export default EditPassword;
