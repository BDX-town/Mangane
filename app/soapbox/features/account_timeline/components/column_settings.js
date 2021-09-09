import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage } from 'react-intl';
import SettingToggle from '../../notifications/components/setting_toggle';

export default @injectIntl
class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { settings, onChange } = this.props;

    return (
      <div>
        <div className='column-settings__row'>
          <SettingToggle
            prefix='account_timeline'
            settings={settings}
            settingPath={['shows', 'pinned']}
            onChange={onChange}
            label={<FormattedMessage id='account_timeline.column_settings.show_pinned' defaultMessage='Show pinned posts' />}
          />
          <SettingToggle
            prefix='account_timeline'
            settings={settings}
            settingPath={['shows', 'reblog']}
            onChange={onChange}
            label={<FormattedMessage id='home.column_settings.show_reblogs' defaultMessage='Show reposts' />}
          />
        </div>
      </div>
    );
  }

}
