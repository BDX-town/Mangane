import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logIn, verifyCredentials, switchAccount } from 'soapbox/actions/auth';
import { fetchInstance } from 'soapbox/actions/instance';
import { closeModal } from 'soapbox/actions/modals';
import { isStandalone } from 'soapbox/utils/state';

import LoginForm from './login_form';
import OtpAuthForm from './otp_auth_form';

const mapStateToProps = state => ({
  me: state.get('me'),
  isLoading: false,
  standalone: isStandalone(state),
});

export default @connect(mapStateToProps)
@injectIntl
class LoginPage extends ImmutablePureComponent {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    isLoading: false,
    mfa_auth_needed: false,
    mfa_token: '',
    shouldRedirect: false,
  }

  getFormData = (form) => {
    return Object.fromEntries(
      Array.from(form).map(i => [i.name, i.value]),
    );
  }

  componentDidMount() {
    const token = new URLSearchParams(window.location.search).get('token');

    if (token) {
      this.setState({ mfa_token: token, mfa_auth_needed: true });
    }
  }

  handleSubmit = (event) => {
    const { dispatch, intl, me } = this.props;
    const { username, password } = this.getFormData(event.target);
    dispatch(logIn(intl, username, password)).then(({ access_token }) => {
      return dispatch(verifyCredentials(access_token))
        // Refetch the instance for authenticated fetch
        .then(() => dispatch(fetchInstance()));
    }).then(account => {
      dispatch(closeModal());
      this.setState({ shouldRedirect: true });
      if (typeof me === 'string') {
        dispatch(switchAccount(account.id));
      }
    }).catch(error => {
      const data = error.response?.data;
      if (data?.error === 'mfa_required') {
        this.setState({ mfa_auth_needed: true, mfa_token: data.mfa_token });
      }
      this.setState({ isLoading: false });
    });
    this.setState({ isLoading: true });
    event.preventDefault();
  }

  render() {
    const { standalone } = this.props;
    const { isLoading, mfa_auth_needed, mfa_token, shouldRedirect } = this.state;

    if (standalone) return <Redirect to='/login/external' />;

    if (shouldRedirect) return <Redirect to='/' />;

    if (mfa_auth_needed) return <OtpAuthForm mfa_token={mfa_token} />;

    return <LoginForm handleSubmit={this.handleSubmit} isLoading={isLoading} />;
  }

}
