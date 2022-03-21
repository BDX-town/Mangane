import PropTypes from 'prop-types';
import React from 'react';
import InlineSVG from 'react-inlinesvg';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { changeSettingImmediate } from 'soapbox/actions/settings';
import snackbar from 'soapbox/actions/snackbar';
import { Text } from 'soapbox/components/ui';

import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.developers', defaultMessage: 'Developers' },
  leave: { id: 'developers.leave', defaultMessage: 'You have left developers' },
});

const Developers = ({ history }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const leaveDevelopers = (e) => {
    e.preventDefault();

    dispatch(changeSettingImmediate(['isDeveloper'], false));
    dispatch(snackbar.success(intl.formatMessage(messages.leave)));
    history.push('/');
  };

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
        <Link to='/developers/apps/create' className='bg-gray-200 p-4 rounded flex flex-col items-center justify-center space-y-2 hover:-translate-y-1 transition-transform'>
          <InlineSVG src={require('@tabler/icons/icons/apps.svg')} />

          <Text>
            <FormattedMessage id='developers.navigation.app_create_label' defaultMessage='Create an app' />
          </Text>
        </Link>

        <Link to='/developers/settings_store' className='bg-gray-200 p-4 rounded flex flex-col items-center justify-center space-y-2 hover:-translate-y-1 transition-transform'>
          <InlineSVG src={require('@tabler/icons/icons/code-plus.svg')} />

          <Text>
            <FormattedMessage id='developers.navigation.settings_store_label' defaultMessage='Settings store' />
          </Text>
        </Link>

        <Link to='/error' className='bg-gray-200 p-4 rounded flex flex-col items-center justify-center space-y-2 hover:-translate-y-1 transition-transform'>
          <InlineSVG src={require('@tabler/icons/icons/mood-sad.svg')} />

          <Text>
            <FormattedMessage id='developers.navigation.intentional_error_label' defaultMessage='Trigger an error' />
          </Text>
        </Link>

        <button onClick={leaveDevelopers} className='bg-gray-200 p-4 rounded flex flex-col items-center justify-center space-y-2 hover:-translate-y-1 transition-transform'>
          <InlineSVG src={require('@tabler/icons/icons/logout.svg')} />

          <Text>
            <FormattedMessage id='developers.navigation.leave_developers_label' defaultMessage='Leave developers' />
          </Text>
        </button>
      </div>
    </Column>
  );
};

Developers.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Developers);
