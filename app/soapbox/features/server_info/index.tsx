import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { useAppSelector } from 'soapbox/hooks';

import Column from '../ui/components/column';
import LinkFooter from '../ui/components/link_footer';
import PromoPanel from '../ui/components/promo_panel';

const messages = defineMessages({
  heading: { id: 'column.info', defaultMessage: 'Server information' },
});

const ServerInfo = () => {
  const intl = useIntl();
  const instance = useAppSelector((state) => state.instance);

  return (
    <Column icon='info' label={intl.formatMessage(messages.heading)}>
      <div className='info_column_area'>
        <div className='info__brand'>
          <div className='brand'>
            <h1>{instance.title}</h1>
          </div>
          <div className='brand__tagline'>
            <span>{instance.description}</span>
          </div>
        </div>
        <PromoPanel />
        <LinkFooter />
      </div>
    </Column>
  );
};

export default ServerInfo;
