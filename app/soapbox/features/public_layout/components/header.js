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

const messages = defineMessages({
  home: { id: 'header.home.label', defaultMessage: 'Home' },
  about: { id: 'header.about.label', defaultMessage: 'About' },
  backTo: { id: 'header.back_to.label', defaultMessage: 'Back to' },
  login: { id: 'header.login.label', defaultMessage: 'Log in' },
});

const mapStateToProps = state => ({
  me: state.get('me'),
  instance: state.get('instance'),
});

export default @connect(mapStateToProps)
@injectIntl
class Header extends ImmutablePureComponent {

  static propTypes = {
    me: SoapboxPropTypes.me,
    instance: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { me, instance, intl } = this.props;

    return (
      <nav className='header'>
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
                ? <Link className='nav-link nav-button webapp-btn' to='/'>{intl.formatMessage(messages.backTo)} {instance.get('title')}</Link>
                : <LoginForm />
              }
            </div>
            <div className='visible-sm'>
              {me
                ? <Link className='nav-link nav-button webapp-btn' to='/'>{intl.formatMessage(messages.backTo)} {instance.get('title')}</Link>
                : <Link className='nav-link nav-button webapp-btn' to='/auth/sign_in'>{intl.formatMessage(messages.login)}</Link>
              }
            </div>
          </div>
        </div>
      </nav>
    );
  }

}
