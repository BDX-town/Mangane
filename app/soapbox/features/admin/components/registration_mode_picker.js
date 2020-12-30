import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import {
  SimpleForm,
  FieldsGroup,
  RadioGroup,
  RadioItem,
} from 'soapbox/features/forms';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  openReportCount: state.getIn(['admin', 'open_report_count']),
});

export default @connect(mapStateToProps)
class RegistrationModePicker extends ImmutablePureComponent {

  render() {
    return (
      <SimpleForm>
        <FieldsGroup>
          <RadioGroup
            label={<FormattedMessage id='admin.dashboard.registration_mode_label' defaultMessage='Registrations' />}
            checked
            onChange={this.onChange}
          >
            <RadioItem
              label={<FormattedMessage id='admin.dashboard.registration_mode.open_label' defaultMessage='Open' />}
              hint={<FormattedMessage id='admin.dashboard.registration_mode.open_hint' defaultMessage='Anyone can join.' />}
              value='open'
            />
            <RadioItem
              label={<FormattedMessage id='admin.dashboard.registration_mode.approval_label' defaultMessage='Approval Required' />}
              hint={<FormattedMessage id='admin.dashboard.registration_mode.approval_hint' defaultMessage='Users can sign up, but their account only gets activated when an admin approves it.' />}
              value='approval'
            />
            <RadioItem
              label={<FormattedMessage id='admin.dashboard.registration_mode.closed_label' defaultMessage='Closed' />}
              hint={<FormattedMessage id='admin.dashboard.registration_mode.closed_hint' defaultMessage='Nobody can sign up. You can still invite people.' />}
              value='closed'
            />
          </RadioGroup>
        </FieldsGroup>
      </SimpleForm>
    );
  };

}
