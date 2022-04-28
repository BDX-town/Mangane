import React from 'react';
import { useHistory } from 'react-router-dom';

import { Tabs } from 'soapbox/components/ui';

interface IAdminTabs {
  activeItem: 'dashboard' | 'reports' | 'approval',
}

const AdminTabs: React.FC<IAdminTabs> = ({ activeItem }) => {
  const history = useHistory();

  const tabs = [{
    name: 'dashboard',
    text: 'Dashboard',
    action: () => history.push('/admin'),
  }, {
    name: 'reports',
    text: 'Reports',
    action: () => history.push('/admin/reports'),
  }, {
    name: 'approval',
    text: 'Waitlist',
    action: () => history.push('/admin/approval'),
  }];

  return <Tabs items={tabs} activeItem={activeItem} />;
};

export default AdminTabs;
