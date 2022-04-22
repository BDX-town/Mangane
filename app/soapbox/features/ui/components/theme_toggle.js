import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages } from 'react-intl';
import Toggle from 'react-toggle';

import Icon from '../../../components/icon';

const messages = defineMessages({
  switchToLight: { id: 'tabs_bar.theme_toggle_light', defaultMessage: 'Switch to light theme' },
  switchToDark: { id: 'tabs_bar.theme_toggle_dark', defaultMessage: 'Switch to dark theme' },
});

export default class ThemeToggle extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    themeMode: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
    showLabel: PropTypes.bool,
  };

  handleToggleTheme = () => {
    this.props.onToggle(this.props.themeMode === 'light' ? 'dark' : 'light');
  }

  render() {
    const { intl, themeMode, showLabel } = this.props;
    const id ='theme-toggle';
    const label = intl.formatMessage(themeMode === 'light' ? messages.switchToDark : messages.switchToLight);

    return (
      <div className='theme-toggle'>
        <div className='setting-toggle' aria-label={label}>
          <Toggle
            id={id}
            checked={themeMode === 'light'}
            onChange={this.handleToggleTheme}
            icons={{ checked: <Icon src={require('@tabler/icons/icons/sun.svg')} />, unchecked: <Icon src={require('@tabler/icons/icons/moon.svg')} /> }}
            onKeyDown={this.onKeyDown}
          />
          {showLabel && (<label htmlFor={id} className='setting-toggle__label'>{label}</label>)}
        </div>
      </div>
    );
  }

}
