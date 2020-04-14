import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import LoginForm from 'gabsocial/features/auth_login/components/login_form';
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
    const { instance, soapbox } = this.props;
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
                <div className='box-widget'>
                  <form className='simple_form new_user' id='new_user' noValidate='novalidate' action='/auth' acceptCharset='UTF-8' method='post'>
                    <div className='simple_form__overlay-area'>
                      <p className='lead'>With an account on <strong>{instance.get('title')}</strong> you'll be able to follow people on any server in the fediverse.</p>
                      <div className='fields-group'>
                        <div className='input with_label string required user_account_username'>
                          <div className='label_input'>
                            <div className='label_input__wrapper'>
                              <input aria-label='Username' autoComplete='off' placeholder='Username' className='string required' required='required' aria-required='true' type='text' name='user[account_attributes][username]' id='user_account_attributes_username' />
                            </div>
                          </div>
                        </div>
                        <div className='input email required user_email'>
                          <input aria-label='E-mail address' autoComplete='off' className='string email required' required='required' aria-required='true' placeholder='E-mail address' type='email' name='user[email]' id='user_email' />
                        </div>
                        <div className='input password required user_password'>
                          <input aria-label='Password' autoComplete='off' className='password required' required='required' aria-required='true' placeholder='Password' type='password' name='user[password]' id='user_password' />
                        </div>
                        <div className='input password required user_password_confirmation'>
                          <input aria-label='Confirm password' autoComplete='off' className='password required' required='required' aria-required='true' placeholder='Confirm password' type='password' name='user[password_confirmation]' id='user_password_confirmation' />
                        </div>
                      </div>
                      <div className='fields-group'>
                        <div className='input with_label boolean optional user_agreement'>
                          <div className='label_input'>
                            <label className='boolean optional' htmlFor='user_agreement'>I agree to the <Link to='/about/tos' target='_blank'>Terms of Service</Link>.</label>
                            <div className='label_input__wrapper'>
                              <label className='checkbox'>
                                <input className='boolean' type='checkbox' name='user[agreement]' id='user_agreement' />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='actions'>
                        <button name='button' type='submit' className='btn button button-primary'>Sign up</button>
                      </div>
                    </div>
                  </form>
                </div>
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
