import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import RegistrationForm from '../auth_login/components/registration_form';
import SiteBanner from '../public_layout/components/site_banner';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

class LandingPage extends ImmutablePureComponent {

  renderClosed = () => {
    const { instance } = this.props;

    return (
      <div className='registrations-closed'>
        <h2>
          <FormattedMessage
            id='registration.closed_title'
            defaultMessage='Registrations Closed'
          />
        </h2>
        <div className='registrations-closed__message'>
          <FormattedMessage
            id='registration.closed_message'
            defaultMessage='{instance} is not accepting new members'
            values={{ instance: <strong>{instance.get('title')}</strong> }}
          />
        </div>
      </div>
    );
  }

  render() {
    const { instance } = this.props;
    const isOpen = instance.get('registrations', false) === true;

    return (
      <div className='landing'>
        <div className='landing-columns'>
          <div className='landing-columns--left'>
            <div className='landing__brand'>
              <Link className='brand' to='/'>
                <SiteBanner />
              </Link>
              <div className='brand__tagline'>
                <span>{instance.get('description')}</span>
              </div>
            </div>
          </div>
          <div className='landing-columns--right'>
            {isOpen ? <RegistrationForm /> : this.renderClosed()}
          </div>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(LandingPage);
