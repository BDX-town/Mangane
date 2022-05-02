import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { Stack, Text } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import type { ReducerAccount } from 'soapbox/reducers/accounts';

const messages = defineMessages({
  title: { id: 'report.confirmation.title', defaultMessage: 'Thanks for submitting your report.' },
  content: { id: 'report.confirmation.content', defaultMessage: 'If we find that this account is violating the {link} we will take further action on the matter.' },
});

interface IOtherActionsStep {
  account: ReducerAccount
}

const termsOfServiceText = (<FormattedMessage
  id='shared.tos'
  defaultMessage='Terms of Service'
/>);

const renderTermsOfServiceLink = (href: string) => (
  <a
    href={href}
    target='_blank'
    className='hover:underline text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-500'
  >
    {termsOfServiceText}
  </a>
);

const ConfirmationStep = ({ account }: IOtherActionsStep) => {
  const intl = useIntl();
  const links = useAppSelector((state) => getSoapboxConfig(state).get('links') as any);

  return (
    <Stack space={1}>
      <Text weight='semibold' tag='h1' size='xl'>
        {intl.formatMessage(messages.title)}
      </Text>

      <Text>
        {intl.formatMessage(messages.content, {
          link: links.get('termsOfService') ?
            renderTermsOfServiceLink(links.get('termsOfService')) :
            termsOfServiceText,
        })}
      </Text>
    </Stack>
  );
};

export default ConfirmationStep;
