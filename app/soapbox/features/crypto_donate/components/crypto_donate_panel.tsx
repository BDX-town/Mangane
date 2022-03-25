import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Widget } from 'soapbox/components/ui';
import { useAppSelector, useSoapboxConfig } from 'soapbox/hooks';

import SiteWallet from './site_wallet';

interface ICryptoDonatePanel {
  limit: number,
}

const CryptoDonatePanel: React.FC<ICryptoDonatePanel> = ({ limit = 3 }): JSX.Element | null => {
  const addresses = useSoapboxConfig().get('cryptoAddresses');
  const siteTitle = useAppSelector((state) => state.instance.title);

  if (limit === 0 || addresses.size === 0) {
    return null;
  }

  const more = addresses.size - limit;
  const hasMore = more > 0;

  return (
    <Widget title={<FormattedMessage id='crypto_donate_panel.heading' defaultMessage='Donate Cryptocurrency' />}>
      <div className='wtf-panel__content'>
        <div className='crypto-donate-panel__message'>
          <FormattedMessage
            id='crypto_donate_panel.intro.message'
            defaultMessage='{siteTitle} accepts cryptocurrency donations to fund our service. Thank you for your support!'
            values={{ siteTitle }}
          />
        </div>
        <SiteWallet limit={limit} />
      </div>
      {hasMore && <Link className='wtf-panel__expand-btn' to='/donate/crypto'>
        <FormattedMessage
          id='crypto_donate_panel.actions.more'
          defaultMessage='Click to see {count} more {count, plural, one {wallet} other {wallets}}'
          values={{ count: more }}
        />
      </Link>}
    </Widget>
  );
};

export default CryptoDonatePanel;
