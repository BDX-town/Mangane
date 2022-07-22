import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { changeSettingImmediate } from 'soapbox/actions/settings';
import snackbar from 'soapbox/actions/snackbar';
import { Text } from 'soapbox/components/ui';
import SvgIcon from 'soapbox/components/ui/icon/svg-icon';
import sourceCode from 'soapbox/utils/code';

import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.developers', defaultMessage: 'Developers' },
  leave: { id: 'developers.leave', defaultMessage: 'You have left developers' },
});

interface IDashWidget {
  to?: string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  children: React.ReactNode,
}

const DashWidget: React.FC<IDashWidget> = ({ to, onClick, children }) => {
  const className = 'bg-gray-200 dark:bg-gray-600 p-4 rounded flex flex-col items-center justify-center space-y-2 hover:-translate-y-1 transition-transform';

  if (to) {
    return <Link className={className} to={to}>{children}</Link>;
  } else {
    return <button className={className} onClick={onClick}>{children}</button>;
  }
};

const Developers: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();

  const leaveDevelopers = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch(changeSettingImmediate(['isDeveloper'], false));
    dispatch(snackbar.success(intl.formatMessage(messages.leave)));
    history.push('/');
  };

  return (
    <>
      <Column label={intl.formatMessage(messages.heading)}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
          <DashWidget to='/developers/apps/create'>
            <SvgIcon src={require('@tabler/icons/apps.svg')} className='dark:text-gray-100' />

            <Text>
              <FormattedMessage id='developers.navigation.app_create_label' defaultMessage='Create an app' />
            </Text>
          </DashWidget>

          <DashWidget to='/developers/settings_store'>
            <SvgIcon src={require('@tabler/icons/code-plus.svg')} className='dark:text-gray-100' />

            <Text>
              <FormattedMessage id='developers.navigation.settings_store_label' defaultMessage='Settings store' />
            </Text>
          </DashWidget>

          <DashWidget to='/developers/timeline'>
            <SvgIcon src={require('@tabler/icons/home.svg')} className='dark:text-gray-100' />

            <Text>
              <FormattedMessage id='developers.navigation.test_timeline_label' defaultMessage='Test timeline' />
            </Text>
          </DashWidget>

          <DashWidget to='/error'>
            <SvgIcon src={require('@tabler/icons/mood-sad.svg')} className='dark:text-gray-100' />

            <Text>
              <FormattedMessage id='developers.navigation.intentional_error_label' defaultMessage='Trigger an error' />
            </Text>
          </DashWidget>

          <DashWidget to='/error/network'>
            <SvgIcon src={require('@tabler/icons/refresh.svg')} className='dark:text-gray-100' />

            <Text>
              <FormattedMessage id='developers.navigation.network_error_label' defaultMessage='Network error' />
            </Text>
          </DashWidget>

          <DashWidget onClick={leaveDevelopers}>
            <SvgIcon src={require('@tabler/icons/logout.svg')} className='dark:text-gray-100' />

            <Text>
              <FormattedMessage id='developers.navigation.leave_developers_label' defaultMessage='Leave developers' />
            </Text>
          </DashWidget>
        </div>
      </Column>

      <div className='p-4'>
        <Text align='center' theme='subtle' size='sm'>
          {sourceCode.displayName} {sourceCode.version}
        </Text>
      </div>
    </>
  );
};

export default Developers;
