import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import Column from '../ui/components/column';
import Icon from 'soapbox/components/icon';

const messages = defineMessages({
  heading: { id: 'column.developers', defaultMessage: 'Developers' },
});

export default @injectIntl
class Developers extends React.Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl } = this.props;

    return (
      <Column heading={intl.formatMessage(messages.heading)}>
        <div className='dashcounters'>
          <div className='dashcounter'>
            <Link to='/developers/apps/create'>
              <div className='dashcounter__icon'>
                <Icon src={require('@tabler/icons/icons/apps.svg')} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='developers.navigation.app_create_label' defaultMessage='Create an app' />
              </div>
            </Link>
          </div>
          <div className='dashcounter'>
            <Link to='/developers/settings_store'>
              <div className='dashcounter__icon'>
                <Icon src={require('@tabler/icons/icons/code-plus.svg')} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='developers.navigation.settings_store_label' defaultMessage='Settings store' />
              </div>
            </Link>
          </div>
          <div className='dashcounter'>
            <Link to='/error'>
              <div className='dashcounter__icon'>
                <Icon src={require('@tabler/icons/icons/mood-sad.svg')} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='developers.navigation.intentional_error_label' defaultMessage='Trigger an error' />
              </div>
            </Link>
          </div>
        </div>
      </Column>
    );
  }

}
