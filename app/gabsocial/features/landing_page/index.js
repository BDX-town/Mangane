import React from 'react';
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  soapbox: state.get('soapbox'),
});

class LandingPage extends ImmutablePureComponent {

  render() {
    return (
      <div className='public-layout'>
        <nav className='header'>
          <div className='header-container'>
            <div className='nav-left'>
              <Link className='brand' to='/'>
                <img alt='Gleasonator' src='https://media.gleasonator.com/site_uploads/files/000/000/002/original/logo.svg' />
              </Link>
              <Link className='nav-link optional' to='/'>Home</Link>
              <Link className='nav-link' to='/about'>About</Link>
            </div>
            <div className='nav-center'></div>
            <div className='nav-right'>
              <div className='hidden-sm'>
                <form className='simple_form new_user' id='new_user' noValidate='novalidate' action='/auth/sign_in' acceptCharset='UTF-8' method='post'>
                  <div className='fields-group'>
                    <div className='input email optional user_email'>
                      <input aria-label='E-mail address' className='string email optional' placeholder='E-mail address' type='email' name='user[email]' id='user_email' />
                    </div>
                    <div className='input password optional user_password'>
                      <input aria-label='Password' className='password optional' placeholder='Password' type='password' name='user[password]' id='user_password' />
                    </div>
                    <p className='hint subtle-hint'>
                      <Link to='/auth/password/new'>Trouble logging in?</Link>
                    </p>
                  </div>
                  <div className='actions'>
                    <button name='button' type='submit' className='btn button button-primary'>Log in</button>
                  </div>
                </form>
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
                  <Link className='brand' to='https://gleasonator.com/'>
                    <img alt='Gleasonator' src='https://media.gleasonator.com/site_uploads/files/000/000/002/original/logo.svg' />
                  </Link>
                  <div className='brand__tagline'>
                    <span>Find friends, share ideas, and reclaim your social networking experience.</span>
                  </div>
                </div>
              </div>
              <div className='landing-columns--right'>
                <div className='box-widget'>
                  <form className='simple_form new_user' id='new_user' noValidate='novalidate' action='/auth' acceptCharset='UTF-8' method='post'>
                    <div className='simple_form__overlay-area'>
                      <p className='lead'>With an account on <strong>gleasonator.com</strong> you'll be able to follow people on any server in the fediverse.</p>
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
      </div>
    )
  }
}

export default connect(mapStateToProps)(LandingPage);
