import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ImmutablePureComponent from 'react-immutable-pure-component';
import LoginForm from './login_form';
import OtpAuthForm from './otp_auth_form';
import { logIn } from 'soapbox/actions/auth';
import { fetchMe } from 'soapbox/actions/me';

const mapStateToProps = state => ({
  me: state.get('me'),
  isLoading: false,
});

export default @connect(mapStateToProps)
class LoginPage extends ImmutablePureComponent {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    isLoading: false,
    mfa_auth_needed: false,
    mfa_token: '',
  }

  getFormData = (form) => {
    return Object.fromEntries(
      Array.from(form).map(i => [i.name, i.value]),
    );
  }

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    const { username, password } = this.getFormData(event.target);
    dispatch(logIn(username, password)).then(() => {
      return dispatch(fetchMe());
    }).catch(error => {
      if (error.response.data.error === 'mfa_required') {
        this.setState({ mfa_auth_needed: true, mfa_token: error.response.data.mfa_token });
      }
      this.setState({ isLoading: false });
    });
    this.setState({ isLoading: true });
    event.preventDefault();
  }

  render() {
    const { me } = this.props;
    const { isLoading, mfa_auth_needed, mfa_token } = this.state;
    if (me) return <Redirect to='/' />;

    if (mfa_auth_needed) return <OtpAuthForm mfa_token={mfa_token} />;

    return <LoginForm handleSubmit={this.handleSubmit} isLoading={isLoading} />;
  }

}
