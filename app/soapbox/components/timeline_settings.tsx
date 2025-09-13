import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changeSetting } from 'soapbox/actions/settings';
import SettingToggle from 'soapbox/features/notifications/components/setting_toggle';
import { useSettings } from 'soapbox/hooks';

import List, { ListItem } from './list';

type ITimelineSettings = {
    onClose: () => void
    timeline: string,
    className?: string,
}

function TimelineSettings({ timeline, onClose, className = '' }: ITimelineSettings) {
  const settings = useSettings();
  const dispatch = useDispatch();

  const onChange = useCallback((key: string[], checked: boolean) => {
    dispatch(changeSetting(key, checked));
  }, [dispatch]);

  return (
    <List className={className}>
      <ListItem
        label={<FormattedMessage id='home.column_settings.show_replies' defaultMessage='Show replies' />}
      >
        <SettingToggle settings={settings} settingPath={[timeline, 'shows', 'reply']} onChange={onChange} />
      </ListItem>
      <ListItem
        label={<FormattedMessage id='home.column_settings.only_media' defaultMessage='Show only media' />}
      >
        <SettingToggle settings={settings} settingPath={[timeline, 'other', 'onlyMedia']} onChange={onChange} />
      </ListItem>
    </List>
  );
}

export default TimelineSettings;