import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { HStack, Input } from 'soapbox/components/ui';
import { StreamfieldComponent } from 'soapbox/components/ui/streamfield/streamfield';

import IconPicker from './icon-picker';

import type { PromoPanelItem } from 'soapbox/types/soapbox';

const messages = defineMessages({
  icon: { id: 'soapbox_config.promo_panel.meta_fields.icon_placeholder', defaultMessage: 'Icon' },
  label: { id: 'soapbox_config.promo_panel.meta_fields.label_placeholder', defaultMessage: 'Label' },
  url: { id: 'soapbox_config.promo_panel.meta_fields.url_placeholder', defaultMessage: 'URL' },
});

const PromoPanelInput: StreamfieldComponent<PromoPanelItem> = ({ value, onChange }) => {
  const intl = useIntl();

  const handleIconChange = (icon: any) => {
    onChange(value.set('icon', icon.id));
  };

  const handleChange = (key: 'text' | 'url'): React.ChangeEventHandler<HTMLInputElement> => {
    return e => {
      onChange(value.set(key, e.currentTarget.value));
    };
  };

  return (
    <HStack space={2} alignItems='center' grow>
      <IconPicker
        value={value.icon}
        onChange={handleIconChange}
      />

      <Input
        type='text'
        outerClassName='w-full flex-grow'
        placeholder={intl.formatMessage(messages.label)}
        value={value.text}
        onChange={handleChange('text')}
      />
      <Input
        type='text'
        outerClassName='w-full flex-grow'
        placeholder={intl.formatMessage(messages.url)}
        value={value.url}
        onChange={handleChange('url')}
      />
    </HStack>
  );
};

export default PromoPanelInput;
