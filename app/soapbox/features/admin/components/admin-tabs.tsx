import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { Tabs } from 'soapbox/components/ui';

const messages = defineMessages({
  dashboard: { id: 'admin_nav.dashboard', defaultMessage: 'Dashboard' },
  reports: { id: 'admin_nav.reports', defaultMessage: 'Reports' },
  waitlist: { id: 'admin_nav.awaiting_approval', defaultMessage: 'Waitlist' },
});

interface IAdminTabs {
  activeItem: 'dashboard' | 'reports' | 'approval',
}

const AdminTabs: React.FC<IAdminTabs> = ({ activeItem }) => {
  const intl = useIntl();
  const history = useHistory();

  const tabs = [{
    name: 'dashboard',
    text: intl.formatMessage(messages.dashboard),
    action: () => history.push('/admin'),
  }, {
    name: 'reports',
    text: intl.formatMessage(messages.reports),
    action: () => history.push('/admin/reports'),
  }, {
    name: 'approval',
    text: intl.formatMessage(messages.waitlist),
    action: () => history.push('/admin/approval'),
  }];

  return <Tabs items={tabs} activeItem={activeItem} />;
};

export default AdminTabs;
