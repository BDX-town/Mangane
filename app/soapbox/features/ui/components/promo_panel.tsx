import React from 'react';

import Icon from 'soapbox/components/icon';
import { Widget, Stack, Text } from 'soapbox/components/ui';
import { useAppSelector, useSettings, useSoapboxConfig } from 'soapbox/hooks';

const PromoPanel: React.FC = () => {
  const { promoPanel } = useSoapboxConfig();
  const settings = useSettings();

  const siteTitle = useAppSelector(state => state.instance.title);
  const promoItems = promoPanel.get('items');
  const locale = settings.get('locale');

  if (!promoItems || promoItems.isEmpty()) return null;

  return (
    <Widget title={siteTitle}>
      <Stack space={2}>
        {promoItems.map((item, i) => (
          <Text key={i}>
            <a className='flex items-center' href={item.url} target='_blank'>
              <Icon id={item.icon} className='flex-none text-lg mr-2' fixedWidth />
              {item.textLocales.get(locale) || item.text}
            </a>
          </Text>
        ))}
      </Stack>
    </Widget>
  );
};

export default PromoPanel;
