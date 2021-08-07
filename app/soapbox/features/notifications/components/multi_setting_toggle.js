import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Toggle from 'react-toggle';

export default class MultiSettingToggle extends React.PureComponent {

  static propTypes = {
    prefix: PropTypes.string,
    settings: ImmutablePropTypes.map.isRequired,
    settingPaths: PropTypes.array.isRequired,
    label: PropTypes.node,
    onChange: PropTypes.func.isRequired,
    icons: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    ariaLabel: PropTypes.string,
  }

  onChange = ({ target }) => {
    for (let i = 0; i < this.props.settingPaths.length; i++) {
      this.props.onChange(this.props.settingPaths[i], target.checked);
    }
  }

  areTrue = (settingPath) => {
    return this.props.settings.getIn(settingPath) === true;
  }

  render() {
    const { prefix, settingPaths, label, icons, ariaLabel } = this.props;
    const id = ['setting-toggle', prefix].filter(Boolean).join('-');

    return (
      <div className='setting-toggle' aria-label={ariaLabel}>
        <Toggle id={id} checked={settingPaths.every(this.areTrue)} onChange={this.onChange} icons={icons} onKeyDown={this.onKeyDown} />
        {label && (<label htmlFor={id} className='setting-toggle__label'>{label}</label>)}
      </div>
    );
  }

}
