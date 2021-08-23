import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import ClearColumnButton from './clear_column_button';
import SettingToggle from './setting_toggle';
import MultiSettingToggle from './multi_setting_toggle';

export default class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    pushSettings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    supportsEmojiReacts: PropTypes.bool,
  };

  onPushChange = (path, checked) => {
    this.props.onChange(['push', ...path], checked);
  }

  onAllSoundsChange = (path, checked) => {
    const soundSettings = [['sounds', 'follow'], ['sounds', 'favourite'], ['sounds', 'pleroma:emoji_reaction'], ['sounds', 'mention'], ['sounds', 'reblog'], ['sounds', 'poll'], ['sounds', 'move']];

    for (let i = 0; i < soundSettings.length; i++) {
      this.props.onChange(soundSettings[i], checked);
    }
  }

  render() {
    const { settings, pushSettings, onChange, onClear, supportsEmojiReacts } = this.props;

    const filterShowStr = <FormattedMessage id='notifications.column_settings.filter_bar.show' defaultMessage='Show' />;
    const filterAdvancedStr = <FormattedMessage id='notifications.column_settings.filter_bar.advanced' defaultMessage='Display all categories' />;
    const alertStr  = <FormattedMessage id='notifications.column_settings.alert' defaultMessage='Desktop notifications' />;
    const allSoundsStr  = <FormattedMessage id='notifications.column_settings.sounds.all_sounds' defaultMessage='Play sound for all notifications' />;
    const showStr   = <FormattedMessage id='notifications.column_settings.show' defaultMessage='Show in column' />;
    const soundStr  = <FormattedMessage id='notifications.column_settings.sound' defaultMessage='Play sound' />;
    const soundSettings = [['sounds', 'follow'], ['sounds', 'favourite'], ['sounds', 'pleroma:emoji_reaction'], ['sounds', 'mention'], ['sounds', 'reblog'], ['sounds', 'poll'], ['sounds', 'move']];
    const showPushSettings = pushSettings.get('browserSupport') && pushSettings.get('isSubscribed');
    const pushStr = showPushSettings && <FormattedMessage id='notifications.column_settings.push' defaultMessage='Push notifications' />;

    return (
      <div>
        <div className='column-settings__row'>
          <ClearColumnButton onClick={onClear} />
        </div>

        <div role='group' aria-labelledby='notifications-all_sounds'>
          <span id='notifications-filter-bar' className='column-settings__section'>
            <FormattedMessage id='notifications.column_settings.sounds' defaultMessage='Sounds' />
          </span>
          <MultiSettingToggle prefix='notifications_all_sounds' settings={settings} settingPaths={soundSettings} onChange={this.onAllSoundsChange} label={allSoundsStr} />
        </div>

        <div role='group' aria-labelledby='notifications-filter-bar'>
          <span id='notifications-filter-bar' className='column-settings__section'>
            <FormattedMessage id='notifications.column_settings.filter_bar.category' defaultMessage='Quick filter bar' />
          </span>
          <div className='column-settings__row'>
            <SettingToggle id='show-filter-bar' prefix='notifications' settings={settings} settingPath={['quickFilter', 'show']} onChange={onChange} label={filterShowStr} />
            <SettingToggle id='show-filter-bar' prefix='notifications' settings={settings} settingPath={['quickFilter', 'advanced']} onChange={onChange} label={filterAdvancedStr} />
          </div>
        </div>

        <div role='group' aria-labelledby='notifications-follow'>
          <span id='notifications-follow' className='column-settings__section'><FormattedMessage id='notifications.column_settings.follow' defaultMessage='New followers:' /></span>

          <div className='column-settings__row'>
            <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'follow']} onChange={onChange} label={alertStr} />
            {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'follow']} onChange={this.onPushChange} label={pushStr} />}
            <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'follow']} onChange={onChange} label={showStr} />
            <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'follow']} onChange={onChange} label={soundStr} />
          </div>
        </div>

        <div role='group' aria-labelledby='notifications-follow-request'>
          <span id='notifications-follow-request' className='column-settings__section'><FormattedMessage id='notifications.column_settings.follow_request' defaultMessage='New follow requests:' /></span>

          <div className='column-settings__row'>
            <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'follow_request']} onChange={onChange} label={alertStr} />
            {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'follow_request']} onChange={this.onPushChange} label={pushStr} />}
            <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'follow_request']} onChange={onChange} label={showStr} />
            <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'follow_request']} onChange={onChange} label={soundStr} />
          </div>
        </div>

        <div role='group' aria-labelledby='notifications-favourite'>
          <span id='notifications-favourite' className='column-settings__section'><FormattedMessage id='notifications.column_settings.favourite' defaultMessage='Likes:' /></span>

          <div className='column-settings__row'>
            <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'favourite']} onChange={onChange} label={alertStr} />
            {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'favourite']} onChange={this.onPushChange} label={pushStr} />}
            <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'favourite']} onChange={onChange} label={showStr} />
            <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'favourite']} onChange={onChange} label={soundStr} />
          </div>
        </div>

        {supportsEmojiReacts && <div role='group' aria-labelledby='notifications-emoji-react'>
          <span id='notifications-favourite' className='column-settings__section'><FormattedMessage id='notifications.column_settings.emoji_react' defaultMessage='Emoji reacts:' /></span>

          <div className='column-settings__row'>
            <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'pleroma:emoji_reaction']} onChange={onChange} label={alertStr} />
            {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'pleroma:emoji_reaction']} onChange={this.onPushChange} label={pushStr} />}
            <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'pleroma:emoji_reaction']} onChange={onChange} label={showStr} />
            <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'pleroma:emoji_reaction']} onChange={onChange} label={soundStr} />
          </div>
        </div>}

        <div role='group' aria-labelledby='notifications-mention'>
          <span id='notifications-mention' className='column-settings__section'><FormattedMessage id='notifications.column_settings.mention' defaultMessage='Mentions:' /></span>

          <div className='column-settings__row'>
            <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'mention']} onChange={onChange} label={alertStr} />
            {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'mention']} onChange={this.onPushChange} label={pushStr} />}
            <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'mention']} onChange={onChange} label={showStr} />
            <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'mention']} onChange={onChange} label={soundStr} />
          </div>
        </div>

        <div role='group' aria-labelledby='notifications-reblog'>
          <span id='notifications-reblog' className='column-settings__section'><FormattedMessage id='notifications.column_settings.reblog' defaultMessage='Reposts:' /></span>

          <div className='column-settings__row'>
            <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'reblog']} onChange={onChange} label={alertStr} />
            {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'reblog']} onChange={this.onPushChange} label={pushStr} />}
            <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'reblog']} onChange={onChange} label={showStr} />
            <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'reblog']} onChange={onChange} label={soundStr} />
          </div>
        </div>

        <div role='group' aria-labelledby='notifications-poll'>
          <span id='notifications-poll' className='column-settings__section'><FormattedMessage id='notifications.column_settings.poll' defaultMessage='Poll results:' /></span>

          <div className='column-settings__row'>
            <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'poll']} onChange={onChange} label={alertStr} />
            {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'poll']} onChange={this.onPushChange} label={pushStr} />}
            <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'poll']} onChange={onChange} label={showStr} />
            <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'poll']} onChange={onChange} label={soundStr} />
          </div>
        </div>

        <div role='group' aria-labelledby='notifications-move'>
          <span id='notifications-move' className='column-settings__section'><FormattedMessage id='notifications.column_settings.move' defaultMessage='Moves:' /></span>

          <div className='column-settings__row'>
            <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'move']} onChange={onChange} label={alertStr} />
            {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'move']} onChange={this.onPushChange} label={pushStr} />}
            <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'move']} onChange={onChange} label={showStr} />
            <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'move']} onChange={onChange} label={soundStr} />
          </div>
        </div>
      </div>
    );
  }

}
