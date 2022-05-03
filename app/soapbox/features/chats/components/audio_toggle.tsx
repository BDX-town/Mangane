import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import Toggle from 'react-toggle';

import { changeSetting, getSettings } from 'soapbox/actions/settings';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  switchOn: { id: 'chats.audio_toggle_on', defaultMessage: 'Audio notification on' },
  switchOff: { id: 'chats.audio_toggle_off', defaultMessage: 'Audio notification off' },
});

interface IAudioToggle {
  showLabel?: boolean
}

const AudioToggle: React.FC<IAudioToggle> = ({ showLabel }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const checked = useAppSelector(state => !!getSettings(state).getIn(['chats', 'sound']));

  const handleToggleAudio = () => {
    dispatch(changeSetting(['chats', 'sound'], !checked));
  };

  const id = 'chats-audio-toggle';
  const label = intl.formatMessage(checked ? messages.switchOff : messages.switchOn);

  return (
    <div className='audio-toggle react-toggle--mini'>
      <div className='setting-toggle' aria-label={label}>
        <Toggle
          id={id}
          checked={checked}
          onChange={handleToggleAudio}
          // onKeyDown={this.onKeyDown}
        />
        {showLabel && (<label htmlFor={id} className='setting-toggle__label'>{label}</label>)}
      </div>
    </div>
  );
};

export default AudioToggle;
