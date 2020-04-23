import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TextInput } from 'gabsocial/features/forms';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

export default @connect(mapStateToProps)
class RegistrationForm extends ImmutablePureComponent {

  static propTypes = {
    instance: ImmutablePropTypes.map,
  }

  render() {
    const { instance } = this.props;

    return (
      <div className='box-widget'>
        <form className='simple_form new_user' id='new_user' noValidate='novalidate' action='/auth' acceptCharset='UTF-8' method='post'>
          <div className='simple_form__overlay-area'>
            <p className='lead'>With an account on <strong>{instance.get('title')}</strong> you'll be able to follow people on any server in the fediverse.</p>
            <div className='fields-group'>
              <TextInput
                placeholder='Username'
                name='username'
                autoComplete='off'
                required
              />
              <TextInput
                placeholder='E-mail address'
                name='email'
                type='email'
                autoComplete='off'
                required
              />
              <TextInput
                placeholder='Password'
                name='password'
                type='password'
                autoComplete='off'
                required
              />
              <TextInput
                placeholder='Confirm password'
                name='password_confirmation'
                type='password'
                autoComplete='off'
                required
              />
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
    );
  }

}
