import React from 'react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

import { updateConfig } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';
import {
  SimpleForm,
  FieldsGroup,
  RadioGroup,
  RadioItem,
} from 'soapbox/features/forms';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

import type { Instance } from 'soapbox/types/entities';

type RegistrationMode = 'open' | 'approval' | 'closed';

const messages = defineMessages({
  saved: { id: 'admin.dashboard.settings_saved', defaultMessage: 'Settings saved!' },
});

const generateConfig = (mode: RegistrationMode) => {
  const configMap = {
    open: [{ tuple: [':registrations_open', true] }, { tuple: [':account_approval_required', false] }],
    approval: [{ tuple: [':registrations_open', true] }, { tuple: [':account_approval_required', true] }],
    closed: [{ tuple: [':registrations_open', false] }],
  };

  return [{
    group: ':pleroma',
    key: ':instance',
    value: configMap[mode],
  }];
};

const modeFromInstance = (instance: Instance): RegistrationMode => {
  if (instance.approval_required && instance.registrations) return 'approval';
  return instance.registrations ? 'open' : 'closed';
};

/** Allows changing the registration mode of the instance, eg "open", "closed", "approval" */
const RegistrationModePicker: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const mode = useAppSelector(state => modeFromInstance(state.instance));

  const onChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const config = generateConfig(e.target.value as RegistrationMode);
    dispatch(updateConfig(config)).then(() => {
      dispatch(snackbar.success(intl.formatMessage(messages.saved)));
    }).catch(() => {});
  };

  return (
    <SimpleForm>
      <FieldsGroup>
        <RadioGroup
          label={<FormattedMessage id='admin.dashboard.registration_mode_label' defaultMessage='Registrations' />}
          onChange={onChange}
        >
          <RadioItem
            label={<FormattedMessage id='admin.dashboard.registration_mode.open_label' defaultMessage='Open' />}
            hint={<FormattedMessage id='admin.dashboard.registration_mode.open_hint' defaultMessage='Anyone can join.' />}
            checked={mode === 'open'}
            value='open'
          />
          <RadioItem
            label={<FormattedMessage id='admin.dashboard.registration_mode.approval_label' defaultMessage='Approval Required' />}
            hint={<FormattedMessage id='admin.dashboard.registration_mode.approval_hint' defaultMessage='Users can sign up, but their account only gets activated when an admin approves it.' />}
            checked={mode === 'approval'}
            value='approval'
          />
          <RadioItem
            label={<FormattedMessage id='admin.dashboard.registration_mode.closed_label' defaultMessage='Closed' />}
            hint={<FormattedMessage id='admin.dashboard.registration_mode.closed_hint' defaultMessage='Nobody can sign up. You can still invite people.' />}
            checked={mode === 'closed'}
            value='closed'
          />
        </RadioGroup>
      </FieldsGroup>
    </SimpleForm>
  );
};

export default RegistrationModePicker;
