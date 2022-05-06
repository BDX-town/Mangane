import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { HStack, Input } from 'soapbox/components/ui';
import { StreamfieldComponent } from 'soapbox/components/ui/streamfield/streamfield';

import type { FooterItem } from 'soapbox/types/soapbox';

const messages = defineMessages({
  label: { id: 'soapbox_config.home_footer.meta_fields.label_placeholder', defaultMessage: 'Label' },
  url: { id: 'soapbox_config.home_footer.meta_fields.url_placeholder', defaultMessage: 'URL' },
});

const PromoPanelInput: StreamfieldComponent<FooterItem> = ({ value, onChange }) => {
  const intl = useIntl();

  const handleChange = (key: 'title' | 'url'): React.ChangeEventHandler<HTMLInputElement> => {
    return e => {
      onChange(value.set(key, e.currentTarget.value));
    };
  };

  return (
    <HStack space={2} grow>
      <Input
        type='text'
        outerClassName='w-full flex-grow'
        placeholder={intl.formatMessage(messages.label)}
        value={value.title}
        onChange={handleChange('title')}
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
