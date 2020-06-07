import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import LoginForm from 'soapbox/features/auth_login/components/login_form';
import SiteLogo from './site_logo';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';

const mapStateToProps = state => ({
  me: state.get('me'),
  instance: state.get('instance'),
});

export default @connect(mapStateToProps)
class Header extends ImmutablePureComponent {

  static propTypes = {
    me: SoapboxPropTypes.me,
    instance: ImmutablePropTypes.map,
  }

  render() {
    const { me, instance } = this.props;

    return (
      <nav className='header'>
        <div className='header-container'>
          <div className='nav-left'>
            <Link className='brand' to='/'>
              <SiteLogo />
            </Link>
            <Link className='nav-link optional' to='/'>Home</Link>
            <Link className='nav-link' to='/about'>About</Link>
          </div>
          <div className='nav-center' />
          <div className='nav-right'>
            <div className='hidden-sm'>
              {me
                ? <Link className='nav-link nav-button webapp-btn' to='/'>Back to {instance.get('title')}</Link>
                : <LoginForm />
              }
            </div>
            <div className='visible-sm'>
              <Link className='nav-link nav-button webapp-btn' to='/auth/sign_in'>Log in</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

}
