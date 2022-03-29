import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { moveAccount } from 'soapbox/actions/security';
import snackbar from 'soapbox/actions/snackbar';
import ShowablePassword from 'soapbox/components/showable_password';
import { FieldsGroup, SimpleForm, TextInput } from 'soapbox/features/forms';
import Column from 'soapbox/features/ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.migration', defaultMessage: 'Account migration' },
  submit: { id: 'migration.submit', defaultMessage: 'Move followers' },
  moveAccountSuccess: { id: 'migration.move_account.success', defaultMessage: 'Account successfully moved.' },
  moveAccountFail: { id: 'migration.move_account.fail', defaultMessage: 'Account migration failed.' },
  acctFieldLabel: { id: 'migration.fields.acct.label', defaultMessage: 'Handle of the new account' },
  acctFieldPlaceholder: { id: 'migration.fields.acct.placeholder', defaultMessage: 'username@domain' },
  currentPasswordFieldLabel: { id: 'migration.fields.confirm_password.label', defaultMessage: 'Current password' },
});

export default @connect()
@injectIntl
class Migration extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    targetAccount: '',
    password: '',
    isLoading: false,
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  clearForm = () => {
    this.setState({ targetAccount: '', password: '' });
  }

  handleSubmit = e => {
    const { targetAccount, password } = this.state;
    const { dispatch, intl } = this.props;
    this.setState({ isLoading: true });
    return dispatch(moveAccount(targetAccount, password)).then(() => {
      this.clearForm();
      dispatch(snackbar.success(intl.formatMessage(messages.moveAccountSuccess)));
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.moveAccountFail)));
    }).then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <Column label={intl.formatMessage(messages.heading)}>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <FieldsGroup>
              <p className='hint'>
                <FormattedMessage
                  id='migration.hint'
                  defaultMessage='This will move your followers to the new account. No other data will be moved. To perform migration, you need to {link} on your new account first.'
                  values={{
                    link: (
                      <Link to='/settings/aliases'>
                        <FormattedMessage
                          id='migration.hint.link'
                          defaultMessage='create an account alias'
                        />
                      </Link>
                    ),
                  }}
                />
              </p>
              <TextInput
                label={intl.formatMessage(messages.acctFieldLabel)}
                placeholder={intl.formatMessage(messages.acctFieldPlaceholder)}
                name='targetAccount'
                value={this.state.targetAccount}
                onChange={this.handleInputChange}
              />
              <ShowablePassword
                label={intl.formatMessage(messages.currentPasswordFieldLabel)}
                name='password'
                value={this.state.password}
                onChange={this.handleInputChange}
              />
              <div className='actions'>
                <button
                  name='button'
                  type='submit'
                  className='btn button button-primary'
                  disabled={!this.state.password || !this.state.targetAccount}
                >
                  {intl.formatMessage(messages.submit)}
                </button>
              </div>
            </FieldsGroup>
          </fieldset>
        </SimpleForm>
      </Column>
    );
  }

}
