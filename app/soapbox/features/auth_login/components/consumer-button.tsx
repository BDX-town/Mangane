import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { prepareRequest } from 'soapbox/actions/consumer-auth';
import { IconButton, Tooltip } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';

const messages = defineMessages({
  tooltip: { id: 'oauth_consumer.tooltip', defaultMessage: 'Sign in with {provider}' },
});

/** Map between OAuth providers and brand icons. */
const BRAND_ICONS: Record<string, string> = {
  twitter: require('@tabler/icons/brand-twitter.svg'),
  facebook: require('@tabler/icons/brand-facebook.svg'),
  google: require('@tabler/icons/brand-google.svg'),
  microsoft: require('@tabler/icons/brand-windows.svg'),
  slack: require('@tabler/icons/brand-slack.svg'),
  github: require('@tabler/icons/brand-github.svg'),
};

/** Capitalize the first letter of a string. */
// https://stackoverflow.com/a/1026087
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface IConsumerButton {
  provider: string,
}

/** OAuth consumer button for logging in with a third-party service. */
const ConsumerButton: React.FC<IConsumerButton> = ({ provider }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const icon = BRAND_ICONS[provider] || require('@tabler/icons/key.svg');

  const handleClick = () => {
    dispatch(prepareRequest(provider));
  };

  return (
    <Tooltip text={intl.formatMessage(messages.tooltip, { provider: capitalize(provider) })}>
      <IconButton
        className='p-2.5 border border-solid bg-transparent border-gray-400 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 focus:border-primary-500 text-gray-900 dark:text-gray-100 focus:ring-primary-500'
        iconClassName='w-6 h-6'
        src={icon}
        onClick={handleClick}
      />
    </Tooltip>
  );
};

export default ConsumerButton;
