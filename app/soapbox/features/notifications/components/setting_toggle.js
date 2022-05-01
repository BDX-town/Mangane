import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Toggle from 'react-toggle';

export default class SettingToggle extends ImmutablePureComponent {

  static propTypes = {
    id: PropTypes.string,
    prefix: PropTypes.string,
    settings: ImmutablePropTypes.map.isRequired,
    settingPath: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  onChange = ({ target }) => {
    this.props.onChange(this.props.settingPath, target.checked);
  }

  render() {
    const { id, settings, settingPath } = this.props;

    return (
      <Toggle
        id={id}
        checked={settings.getIn(settingPath)}
        onChange={this.onChange}
        icons={false}
        onKeyDown={this.onKeyDown}
      />
    );
  }

}
