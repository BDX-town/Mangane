import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';

import { changeSetting, getSettings } from 'soapbox/actions/settings';
import Icon from 'soapbox/components/icon';

const messages = defineMessages({
  switchOn: { id: 'chats.audio_toggle_on', defaultMessage: 'Audio notification on' },
  switchOff: { id: 'chats.audio_toggle_off', defaultMessage: 'Audio notification off' },
});

const mapStateToProps = state => {
  return {
    checked: getSettings(state).getIn(['chats', 'sound'], false),
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
    checked: PropTypes.bool.isRequired,
    toggleAudio: PropTypes.func,
    showLabel: PropTypes.bool,
  };

  handleToggleAudio = () => {
    this.props.toggleAudio(!this.props.checked);
  }

  render() {
    const { intl, checked, showLabel } = this.props;
    const id ='chats-audio-toggle';
    const label = intl.formatMessage(checked ? messages.switchOff : messages.switchOn);

    return (
      <div className='audio-toggle react-toggle--mini'>
        <div className='setting-toggle' aria-label={label}>
          <Toggle
            id={id}
            checked={checked}
            onChange={this.handleToggleAudio}
            icons={{ checked: <Icon src={require('@tabler/icons/icons/volume.svg')} />, unchecked: <Icon src={require('@tabler/icons/icons/volume-3.svg')} /> }}
            onKeyDown={this.onKeyDown}
          />
          {showLabel && (<label htmlFor={id} className='setting-toggle__label'>{label}</label>)}
        </div>
      </div>
    );
  }

}
