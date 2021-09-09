import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import LoginForm from 'soapbox/features/auth_login/components/login_form';
import SiteLogo from './site_logo';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { logIn, verifyCredentials } from 'soapbox/actions/auth';
import { fetchInstance } from 'soapbox/actions/instance';
import OtpAuthForm from 'soapbox/features/auth_login/components/otp_auth_form';
import IconButton from 'soapbox/components/icon_button';

const messages = defineMessages({
  home: { id: 'header.home.label', defaultMessage: 'Home' },
  about: { id: 'header.about.label', defaultMessage: 'About' },
  backTo: { id: 'header.back_to.label', defaultMessage: 'Back to {siteTitle}' },
  login: { id: 'header.login.label', defaultMessage: 'Log in' },
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

const mapStateToProps = state => ({
  me: state.get('me'),
  instance: state.get('instance'),
  isLoading: false,
});

export default @connect(mapStateToProps)
@injectIntl
class Header extends ImmutablePureComponent {

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

  static contextTypes = {
    router: PropTypes.object,
  };

  handleSubmit = (event) => {
    const { dispatch, intl } = this.props;
    const { username, password } = this.getFormData(event.target);
    dispatch(logIn(intl, username, password)).then(({ access_token }) => {
      return dispatch(verifyCredentials(access_token))
        // Refetch the instance for authenticated fetch
        .then(() => dispatch(fetchInstance()));
    }).catch(error => {
      if (error.response.data.error === 'mfa_required') {
        this.setState({ mfa_auth_needed: true, mfa_token: error.response.data.mfa_token });
      }
      this.setState({ isLoading: false });
    });
    this.setState({ isLoading: true });
    event.preventDefault();
  }

  onClickClose = (event) => {
    this.setState({ mfa_auth_needed: false, mfa_token: '' });
  }

  static propTypes = {
    me: SoapboxPropTypes.me,
    instance: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { me, instance, intl } = this.props;
    const { isLoading, mfa_auth_needed, mfa_token } = this.state;

    return (
      <nav className='header'>
        { mfa_auth_needed &&
          <div className='otp-form-overlay__container'>
            <div className='otp-form-overlay__form'>
              <IconButton className='otp-form-overlay__close' title={intl.formatMessage(messages.close)} icon='times' onClick={this.onClickClose} size={20} />
              <OtpAuthForm mfa_token={mfa_token} />
            </div>
          </div>
        }
        <div className='header-container'>
          <div className='nav-left'>
            <Link className='brand' to='/'>
              <SiteLogo />
            </Link>
            <Link className='nav-link optional' to='/'>{intl.formatMessage(messages.home)}</Link>
            <Link className='nav-link' to='/about'>{intl.formatMessage(messages.about)}</Link>
          </div>
          <div className='nav-center' />
          <div className='nav-right'>
            <div className='hidden-sm'>
              {me
                ? <Link className='nav-link nav-button webapp-btn' to='/'>{intl.formatMessage(messages.backTo, { siteTitle: instance.get('title') })}</Link>
                : <LoginForm handleSubmit={this.handleSubmit} isLoading={isLoading} />
              }
            </div>
            <div className='visible-sm'>
              {me
                ? <Link className='nav-link nav-button webapp-btn' to='/'>{intl.formatMessage(messages.backTo, { siteTitle: instance.get('title') })}</Link>
                : <Link className='nav-link nav-button webapp-btn' to='/auth/sign_in'>{intl.formatMessage(messages.login)}</Link>
              }
            </div>
          </div>
        </div>
      </nav>
    );
  }

}
