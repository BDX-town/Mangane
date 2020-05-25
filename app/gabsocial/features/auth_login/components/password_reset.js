import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { resetPassword } from 'gabsocial/actions/auth';
import { SimpleForm, FieldsGroup, TextInput } from 'gabsocial/features/forms';
import { Redirect } from 'react-router-dom';
import { showAlert } from 'gabsocial/actions/alerts';

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
      dispatch(showAlert('Password reset received. Check your email for further instructions.', ''));
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
