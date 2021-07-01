import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import Icon from 'soapbox/components/icon';
import { changeSetting, getSettings } from 'soapbox/actions/settings';
import Toggle from 'react-toggle';

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
            icons={{ checked: <Icon id='volume-up' />, unchecked: <Icon id='volume-off' /> }}
            onKeyDown={this.onKeyDown}
          />
          {showLabel && (<label htmlFor={id} className='setting-toggle__label'>{label}</label>)}
        </div>
      </div>
    );
  }

}
