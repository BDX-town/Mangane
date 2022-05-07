import React from 'react';
import { FormattedMessage } from 'react-intl';

import RegistrationForm from 'soapbox/features/auth_login/components/registration_form';
import { useAppSelector } from 'soapbox/hooks';

interface IRegisterInvite {
  /** URL params. */
  params: {
    /** Invite token from the URL. */
    token: string,
  },
}

/** Page to register with an invitation. */
const RegisterInvite: React.FC<IRegisterInvite> = ({ params }) => {
  const siteTitle = useAppSelector(state => state.instance.title);

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
};

export default RegisterInvite;
