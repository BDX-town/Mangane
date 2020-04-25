import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import LoginForm from 'gabsocial/features/auth_login/components/login_form';
import SiteLogo from './site_logo';

export default class Header extends ImmutablePureComponent {

  render() {
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
              <LoginForm />
            </div>
            <div className='visible-sm'>
              <Link className='webapp-btn nav-link nav-button' to='/auth/sign_in'>Log in</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

}
