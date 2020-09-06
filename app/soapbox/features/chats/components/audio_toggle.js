import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Icon from 'soapbox/components/icon';
import { changeSetting, getSettings } from 'soapbox/actions/settings';
import SettingToggle from 'soapbox/features/notifications/components/setting_toggle';

const messages = defineMessages({
  switchToOn: { id: 'chats.audio_toggle_on', defaultMessage: 'Audio notification on' },
  switchToOff: { id: 'chats.audio_toggle_off', defaultMessage: 'Audio notification off' },
});

const mapStateToProps = state => {
  return {
    settings: getSettings(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleAudio(setting) {
    dispatch(changeSetting(['chats', 'sound'], setting));
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class AudioToggle extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    toggleAudio: PropTypes.func,
    showLabel: PropTypes.bool,
  };

  handleToggleAudio = () => {
    this.props.toggleAudio(this.props.settings.getIn(['chats', 'sound']) === true ? false : true);
  }

  render() {
    const { intl, settings, showLabel } = this.props;
    let toggle = (
      <SettingToggle settings={settings} settingPath={['chats', 'sound']} onChange={this.handleToggleAudio} icons={{ checked: <Icon id='volume-up' />, unchecked: <Icon id='volume-off' /> }} ariaLabel={settings.get('chats', 'sound') === true ? intl.formatMessage(messages.switchToOff) : intl.formatMessage(messages.switchToOn)} />
    );

    if (showLabel) {
      toggle = (
        <SettingToggle settings={settings} settingPath={['chats', 'sound']} onChange={this.handleToggleAudio} icons={{ checked: <Icon id='volume-up' />, unchecked: <Icon id='volume-off' /> }} label={settings.get('chats', 'sound') === true ? intl.formatMessage(messages.switchToOff) : intl.formatMessage(messages.switchToOn)} />
      );
    }

    return (
      <div className='audio-toggle react-toggle--mini'>
        {toggle}
      </div>
    );
  }

}
