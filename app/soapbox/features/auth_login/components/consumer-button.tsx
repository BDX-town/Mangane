import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { prepareRequest } from 'soapbox/actions/consumer-auth';
import { IconButton, Tooltip } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';
import { capitalize } from 'soapbox/utils/strings';

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
        theme='outlined'
        className='p-2.5'
        iconClassName='w-6 h-6'
        src={icon}
        onClick={handleClick}
      />
    </Tooltip>
  );
};

export default ConsumerButton;
