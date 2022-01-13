import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { changeSettingImmediate } from 'soapbox/actions/settings';
import snackbar from 'soapbox/actions/snackbar';
import Icon from 'soapbox/components/icon';

import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.developers', defaultMessage: 'Developers' },
  leave: { id: 'developers.leave', defaultMessage: 'You have left developers' },
});

export default @connect()
@injectIntl
class DevelopersMenu extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  leaveDevelopers = e => {
    const { intl, dispatch } = this.props;

    dispatch(changeSettingImmediate(['isDeveloper'], false));
    dispatch(snackbar.success(intl.formatMessage(messages.leave)));

    this.context.router.history.push('/');
    e.preventDefault();
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
          <div className='dashcounter'>
            <a href='#' onClick={this.leaveDevelopers}>
              <div className='dashcounter__icon'>
                <Icon src={require('@tabler/icons/icons/logout.svg')} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='developers.navigation.leave_developers_label' defaultMessage='Leave developers' />
              </div>
            </a>
          </div>
        </div>
      </Column>
    );
  }

}
