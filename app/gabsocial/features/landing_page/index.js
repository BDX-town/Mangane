import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import LoginForm from 'gabsocial/features/auth_login/components/login_form';
import RegistrationForm from './components/registration_form';
import NotificationsContainer from 'gabsocial/features/ui/containers/notifications_container';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  soapbox: state.get('soapbox'),
});

class LandingPage extends ImmutablePureComponent {

  getSiteLogo = () => {
    const { instance, soapbox } = this.props;
    const logos = {
      imgLogo:  (<img alt={instance.get('title')} src={soapbox.get('logo')} />),
      textLogo: (<h1>{instance.get('title')}</h1>),
    };
    return soapbox.get('logo') ? logos.imgLogo : logos.textLogo;
  }

  render() {
    const { instance } = this.props;
    if (instance.isEmpty()) return null;
    const siteLogo = this.getSiteLogo();

    return (
      <div className='public-layout'>
        <nav className='header'>
          <div className='header-container'>
            <div className='nav-left'>
              <Link className='brand' to='/'>
                {siteLogo}
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
        <div className='container'>
          <div className='landing'>
            <div className='landing-columns'>
              <div className='landing-columns--left'>
                <div className='landing__brand'>
                  <Link className='brand' to='/'>
                    {siteLogo}
                  </Link>
                  <div className='brand__tagline'>
                    <span>{instance.get('description')}</span>
                  </div>
                </div>
              </div>
              <div className='landing-columns--right'>
                <RegistrationForm />
              </div>
            </div>
          </div>
        </div>
        <div className='footer'>
          <div className='footer-container'>
            <div className='copyright'>
              <span>♡{new Date().getFullYear()}. Copying is an act of love. Please copy and share.</span>
            </div>
            <ul>
              <li><Link to='/about'>About</Link></li>
              <li><Link to='/about/tos'>Terms of Service</Link></li>
              <li><Link to='/about/privacy'>Privacy Policy</Link></li>
              <li><Link to='/about/dmca'>DMCA</Link></li>
              <li><Link to='/about#opensource'>Source Code</Link></li>
            </ul>
          </div>
        </div>
        <NotificationsContainer />
      </div>
    );
  }

}

export default connect(mapStateToProps)(LandingPage);
