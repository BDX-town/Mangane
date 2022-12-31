import React from 'react';

import { Widget, Stack, Text } from 'soapbox/components/ui';
import { useSettings, useSoapboxConfig } from 'soapbox/hooks';

const PromoPanel: React.FC = () => {
  const { promoPanel } = useSoapboxConfig();
  const settings = useSettings();

  const promoItems = promoPanel.get('items');
  const locale = settings.get('locale');

  if (!promoItems || promoItems.isEmpty()) return null;

  return (
    <Widget title=''>
      <Stack space={2}>
        {promoItems.map((item, i) => (
          <Text key={i}>
            <a className='flex items-center' href={item.url} target='_blank'>
              <div className='text-lg mr-2 grayscale'>
                { item.icon }
              </div>
              {item.textLocales.get(locale) || item.text}
            </a>
          </Text>
        ))}
      </Stack>
    </Widget>
  );
};

export default PromoPanel;
