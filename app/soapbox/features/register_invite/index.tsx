import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { Stack, CardTitle, Text } from 'soapbox/components/ui';
import RegistrationForm from 'soapbox/features/auth_login/components/registration_form';
import { useAppSelector } from 'soapbox/hooks';

interface RegisterInviteParams {
  token: string,
}

/** Page to register with an invitation. */
const RegisterInvite: React.FC = () => {
  const { token } = useParams<RegisterInviteParams>();
  const siteTitle = useAppSelector(state => state.instance.title);

  const title = (
    <FormattedMessage
      id='register_invite.title'
      defaultMessage="You've been invited to join {siteTitle}!"
      values={{ siteTitle }}
    />
  );

  return (
    <Stack space={3}>
      <Stack className='mb-4'>
        <CardTitle title={title} />

        <Text theme='muted'>
          <FormattedMessage
            id='register_invite.lead'
            defaultMessage='Complete the form below to create an account.'
          />
        </Text>
      </Stack>

      <RegistrationForm inviteToken={token} />
    </Stack>
  );
};

export default RegisterInvite;
