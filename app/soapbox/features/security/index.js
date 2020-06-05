import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/column';
import {
  SimpleForm,
  SimpleInput,
  FieldsGroup,
  TextInput,
} from 'soapbox/features/forms';
import { changeEmail } from 'soapbox/actions/security';
import { showAlert } from 'soapbox/actions/alerts';

const messages = defineMessages({
  heading: { id: 'column.security', defaultMessage: 'Security' },
  submit: { id: 'security.submit', defaultMessage: 'Save changes' },
  updateEmailSuccess: { id: 'security.update_email.success', defaultMessage: 'Email successfully updated.' },
  updateEmailFail: { id: 'security.update_email.fail', defaultMessage: 'Update email failed.' },
});

export default @connect()
@injectIntl
class Security extends ImmutablePureComponent {

  static propTypes = {
    email: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    email: '',
    password: '',
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    const { email, password } = this.state;
    const { dispatch, intl } = this.props;
    dispatch(changeEmail(email, password)).then(() => {
      dispatch(showAlert('', intl.formatMessage(messages.updateEmailSuccess)));
    }).catch(error => {
      dispatch(showAlert('', intl.formatMessage(messages.updateEmailFail)));
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <Column icon='lock' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm onSubmit={this.handleSubmit}>
          <FieldsGroup>
            <TextInput
              label='Email address'
              placeholder='me@example.com'
              name='email'
              onChange={this.handleInputChange}
              value={this.state.email}
            />
            <SimpleInput
              type='password'
              label='Password'
              name='password'
              onChange={this.handleInputChange}
              value={this.state.password}
            />
            <div className='actions'>
              <button name='button' type='submit' className='btn button button-primary'>
                {intl.formatMessage(messages.submit)}
              </button>
            </div>
          </FieldsGroup>
        </SimpleForm>
      </Column>
    );
  }

}
