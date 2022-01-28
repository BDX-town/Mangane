import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

import IconButton from 'soapbox/components/icon_button';

import SettingToggle from '../../notifications/components/setting_toggle';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

export default @injectIntl
class ColumnSettings extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const { intl, settings, onChange, onClose } = this.props;

    return (
      <div className='column-settings'>
        <div className='column-settings__header'>
          <h1 className='column-settings__title'>
            <FormattedMessage id='home.column_settings.title' defaultMessage='Home settings' />
          </h1>
          <div className='column-settings__close'>
            <IconButton title={intl.formatMessage(messages.close)} src={require('@tabler/icons/icons/x.svg')} onClick={onClose} />
          </div>
        </div>

        <div className='column-settings__content'>
          <div className='column-settings__row'>
            <SettingToggle prefix='home_timeline' settings={settings} settingPath={['shows', 'reblog']} onChange={onChange} label={<FormattedMessage id='home.column_settings.show_reblogs' defaultMessage='Show reposts' />} />
          </div>

          <div className='column-settings__row'>
            <SettingToggle prefix='home_timeline' settings={settings} settingPath={['shows', 'reply']} onChange={onChange} label={<FormattedMessage id='home.column_settings.show_replies' defaultMessage='Show replies' />} />
          </div>

          <div className='column-settings__row'>
            <SettingToggle prefix='home_timeline' settings={settings} settingPath={['shows', 'direct']} onChange={onChange} label={<FormattedMessage id='home.column_settings.show_direct' defaultMessage='Show direct messages' />} />
          </div>
        </div>
      </div>
    );
  }

}
