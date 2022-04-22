import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

export default class SettingText extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    settingKey: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleChange = (e) => {
    this.props.onChange(this.props.settingKey, e.target.value);
  }

  render() {
    const { settings, settingKey, label } = this.props;

    return (
      <label>
        <span style={{ display: 'none' }}>{label}</span>
        <input
          className='setting-text'
          value={settings.getIn(settingKey)}
          onChange={this.handleChange}
          placeholder={label}
        />
      </label>
    );
  }

}
