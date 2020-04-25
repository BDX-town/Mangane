import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import RegistrationForm from './components/registration_form';
import SiteLogo from '../public_layout/components/site_logo';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

class LandingPage extends ImmutablePureComponent {

  render() {
    const { instance } = this.props;

    return (
      <div className='landing'>
        <div className='landing-columns'>
          <div className='landing-columns--left'>
            <div className='landing__brand'>
              <Link className='brand' to='/'>
                <SiteLogo />
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
    );
  }

}

export default connect(mapStateToProps)(LandingPage);
