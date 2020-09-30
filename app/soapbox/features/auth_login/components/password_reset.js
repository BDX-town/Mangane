import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { resetPassword } from 'soapbox/actions/auth';
import { SimpleForm, FieldsGroup, TextInput } from 'soapbox/features/forms';
import { Redirect } from 'react-router-dom';
import snackbar from 'soapbox/actions/snackbar';

export default @connect()
class PasswordReset extends ImmutablePureComponent {

  state = {
    isLoading: false,
    success: false,
  }

  handleSubmit = e => {
    const { dispatch } = this.props;
    const nicknameOrEmail = e.target.nickname_or_email.value;
    this.setState({ isLoading: true });
    dispatch(resetPassword(nicknameOrEmail)).then(() => {
      this.setState({ isLoading: false, success: true });
      dispatch(snackbar.info('Check your email for confirmation.'));
    }).catch(error => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    if (this.state.success) return <Redirect to='/' />;

    return (
      <SimpleForm onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.isLoading}>
          <FieldsGroup>
            <TextInput
              name='nickname_or_email'
              label='Email or username'
              placeholder='me@example.com'
            />
          </FieldsGroup>
        </fieldset>
        <div className='actions'>
          <button name='button' type='submit' className='btn button button-primary'>Reset password</button>
        </div>
      </SimpleForm>
    );
  }

}
