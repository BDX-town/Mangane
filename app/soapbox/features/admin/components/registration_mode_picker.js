import React from 'react';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import {
  SimpleForm,
  FieldsGroup,
  RadioGroup,
  RadioItem,
} from 'soapbox/features/forms';
import { updateConfig } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';

const messages = defineMessages({
  saved: { id: 'admin.dashboard.settings_saved', defaultMessage: 'Settings saved!' },
});

const mapStateToProps = (state, props) => ({
  mode: modeFromInstance(state.get('instance')),
});

const generateConfig = mode => {
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

const modeFromInstance = instance => {
  if (instance.get('approval_required') && instance.get('registrations')) return 'approval';
  return instance.get('registrations') ? 'open' : 'closed';
};

export default @connect(mapStateToProps)
@injectIntl
class RegistrationModePicker extends ImmutablePureComponent {

  onChange = e => {
    const { dispatch, intl } = this.props;
    const config = generateConfig(e.target.value);
    dispatch(updateConfig(config)).then(() => {
      dispatch(snackbar.success(intl.formatMessage(messages.saved)));
    }).catch(() => {});
  }

  render() {
    const { mode } = this.props;

    return (
      <SimpleForm>
        <FieldsGroup>
          <RadioGroup
            label={<FormattedMessage id='admin.dashboard.registration_mode_label' defaultMessage='Registrations' />}
            onChange={this.onChange}
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
  }

}
