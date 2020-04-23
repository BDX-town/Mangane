import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  SimpleForm,
  SimpleInput,
  TextInput,
  Checkbox,
} from 'gabsocial/features/forms';
import { register } from 'gabsocial/actions/auth';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

export default @connect(mapStateToProps)
class RegistrationForm extends ImmutablePureComponent {

  static propTypes = {
    instance: ImmutablePropTypes.map,
  }

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCheckboxChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  onSubmit = e => {
    this.props.dispatch(register(this.state));
  }

  render() {
    const { instance } = this.props;

    return (
      <div className='box-widget'>
        <SimpleForm onSubmit={this.onSubmit}>
          <div className='simple_form__overlay-area'>
            <p className='lead'>With an account on <strong>{instance.get('title')}</strong> you'll be able to follow people on any server in the fediverse.</p>
            <div className='fields-group'>
              <TextInput
                placeholder='Username'
                name='username'
                autoComplete='off'
                onChange={this.onInputChange}
                required
              />
              <SimpleInput
                placeholder='E-mail address'
                name='email'
                type='email'
                autoComplete='off'
                onChange={this.onInputChange}
                required
              />
              <SimpleInput
                placeholder='Password'
                name='password'
                type='password'
                autoComplete='off'
                onChange={this.onInputChange}
                required
              />
              <SimpleInput
                placeholder='Confirm password'
                name='confirm'
                type='password'
                autoComplete='off'
                onChange={this.onInputChange}
                required
              />
            </div>
            <div className='fields-group'>
              <Checkbox
                label={<>I agree to the <Link to='/about/tos' target='_blank'>Terms of Service</Link>.</>}
                name='agreement'
                onChange={this.onCheckboxChange}
                required
              />
            </div>
            <input type='hidden' name='locale' value='en_US' />
            <div className='actions'>
              <button name='button' type='submit' className='btn button button-primary'>Sign up</button>
            </div>
          </div>
        </SimpleForm>
      </div>
    );
  }

}
