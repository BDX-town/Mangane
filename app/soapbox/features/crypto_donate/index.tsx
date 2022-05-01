import React, { useState } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { Column, Stack } from 'soapbox/components/ui';
import Accordion from 'soapbox/features/ui/components/accordion';
import { useAppSelector } from 'soapbox/hooks';

import SiteWallet from './components/site_wallet';

const messages = defineMessages({
  heading: { id: 'column.crypto_donate', defaultMessage: 'Donate Cryptocurrency' },
});

const CryptoDonate: React.FC = (): JSX.Element => {
  const [explanationBoxExpanded, toggleExplanationBox] = useState(true);
  const siteTitle = useAppSelector((state) => state.instance.title);
  const intl = useIntl();

  return (
    <Column label={intl.formatMessage(messages.heading)} withHeader>
      <Stack space={5}>
        <Accordion
          headline={<FormattedMessage id='crypto_donate.explanation_box.title' defaultMessage='Sending cryptocurrency donations' />}
          expanded={explanationBoxExpanded}
          onToggle={toggleExplanationBox}
        >
          <FormattedMessage
            id='crypto_donate.explanation_box.message'
            defaultMessage='{siteTitle} accepts cryptocurrency donations. You may send a donation to any of the addresses below. Thank you for your support!'
            values={{ siteTitle }}
          />
        </Accordion>

        <SiteWallet />
      </Stack>
    </Column>
  );
};

export default CryptoDonate;
