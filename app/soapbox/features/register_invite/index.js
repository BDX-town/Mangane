import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import RegistrationForm from 'soapbox/features/auth_login/components/registration_form';

const mapStateToProps = state => {
  return {
    siteTitle: state.getIn(['instance', 'title']),
  };
};

export default @connect(mapStateToProps)
class RegisterInvite extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    siteTitle: PropTypes.string.isRequired,
  }

  render() {
    const { siteTitle, params } = this.props;

    return (
      <div className='register-invite'>
        <div className='register-invite__header'>
          <h1 className='register-invite__title'>
            <FormattedMessage
              id='register_invite.title'
              defaultMessage="You've been invited to join {siteTitle}!"
              values={{ siteTitle }}
            />
          </h1>
          <p className='register-invite__lead'>
            <FormattedMessage
              id='register_invite.lead'
              defaultMessage='Complete the form below to create an account.'
            />
          </p>
        </div>
        <div className='register-invite__form'>
          <RegistrationForm inviteToken={params.token} />
        </div>
      </div>
    );
  }

}
