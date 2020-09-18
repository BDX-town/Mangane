import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Toggle from 'react-toggle';

export default class SettingToggle extends React.PureComponent {

  static propTypes = {
    prefix: PropTypes.string,
    settings: ImmutablePropTypes.map.isRequired,
    settingPath: PropTypes.array.isRequired,
    label: PropTypes.node,
    onChange: PropTypes.func.isRequired,
    icons: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    condition: PropTypes.string,
    ariaLabel: PropTypes.string,
  }

  onChange = ({ target }) => {
    this.props.onChange(this.props.settingPath, target.checked);
  }

  render() {
    const { prefix, settings, settingPath, label, icons, condition, ariaLabel } = this.props;
    const id = ['setting-toggle', prefix, ...settingPath].filter(Boolean).join('-');

    return (
      <div className='setting-toggle' aria-label={ariaLabel}>
        <Toggle id={id} checked={condition ? settings.getIn(settingPath) === condition : settings.getIn(settingPath)} onChange={this.onChange} icons={icons} onKeyDown={this.onKeyDown} />
        {label && (<label htmlFor={id} className='setting-toggle__label'>{label}</label>)}
      </div>
    );
  }

}
