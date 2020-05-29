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
} from 'soapbox/features/forms';
import { register } from 'soapbox/actions/auth';
import CaptchaField from 'soapbox/features/auth_login/components/captcha';
import { Map as ImmutableMap } from 'immutable';
import { v4 as uuidv4 } from 'uuid';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

export default @connect(mapStateToProps)
class RegistrationForm extends ImmutablePureComponent {

  static propTypes = {
    instance: ImmutablePropTypes.map,
  }

  state = {
    captchaLoading: true,
    submissionLoading: false,
    params: ImmutableMap(),
    captchaIdempotencyKey: uuidv4(),
  }

  setParams = map => {
    this.setState({ params: this.state.params.merge(ImmutableMap(map)) });
  }

  onInputChange = e => {
    this.setParams({ [e.target.name]: e.target.value });
  }

  onCheckboxChange = e => {
    this.setParams({ [e.target.name]: e.target.checked });
  }

  onSubmit = e => {
    this.setState({ submissionLoading: true });
    this.props.dispatch(register(this.state.params.toJS())).catch(error => {
      this.setState({ submissionLoading: false });
    });
  }

  onFetchCaptcha = captcha => {
    this.setState({ captchaLoading: false });
    this.setParams({
      captcha_token: captcha.get('token'),
      captcha_answer_data: captcha.get('answer_data'),
    });
  }

  onFetchCaptchaFail = error => {
    this.setState({ captchaLoading: false });
  }

  refreshCaptcha = () => {
    this.setState({ captchaIdempotencyKey: uuidv4() });
  }

  render() {
    const { instance } = this.props;
    const isLoading = this.state.captchaLoading || this.state.submissionLoading;

    return (
      <div className='box-widget'>
        <SimpleForm onSubmit={this.onSubmit}>
          <fieldset disabled={isLoading}>
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
              <CaptchaField
                onFetch={this.onFetchCaptcha}
                onFetchFail={this.onFetchCaptchaFail}
                onChange={this.onInputChange}
                idempotencyKey={this.state.captchaIdempotencyKey}
              />
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
          </fieldset>
        </SimpleForm>
      </div>
    );
  }

}
