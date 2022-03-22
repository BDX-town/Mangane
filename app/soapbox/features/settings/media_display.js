import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { getSettings, changeSettingImmediate } from 'soapbox/actions/settings';
import {
  SimpleForm,
  SelectDropdown,
} from 'soapbox/features/forms';
import { useAppSelector } from 'soapbox/hooks';

import List, { ListItem } from '../../components/list';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui';

const messages = defineMessages({
  mediaDisplay: { id: 'preferences.fields.media_display_label', defaultMessage: 'Media display' },
  display_media_default: { id: 'preferences.fields.display_media.default', defaultMessage: 'Hide media marked as sensitive' },
  display_media_hide_all: { id: 'preferences.fields.display_media.hide_all', defaultMessage: 'Always hide media' },
  display_media_show_all: { id: 'preferences.fields.display_media.show_all', defaultMessage: 'Always show media' },
});

const MediaDisplay = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const settings = useAppSelector((state) => getSettings(state));

  const displayMediaOptions = {
    default: intl.formatMessage(messages.display_media_default),
    hide_all: intl.formatMessage(messages.display_media_hide_all),
    show_all: intl.formatMessage(messages.display_media_show_all),
  };

  const onSelectChange = path => {
    return e => {
      dispatch(changeSettingImmediate(path, e.target.value));
    };
  };

  return (
    <Card variant='rounded'>
      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.mediaDisplay)} />
      </CardHeader>

      <CardBody>
        <SimpleForm className='p-0 space-y-3'>
          <List>
            <ListItem label={intl.formatMessage(messages.mediaDisplay)}>
              <SelectDropdown
                items={displayMediaOptions}
                defaultValue={settings.get('displayMedia')}
                onChange={onSelectChange(['displayMedia'])}
              />
            </ListItem>
          </List>
        </SimpleForm>
      </CardBody>
    </Card>
  );
};

export default MediaDisplay;
