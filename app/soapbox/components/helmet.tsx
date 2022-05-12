import * as React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

import { useAppSelector, useSettings } from 'soapbox/hooks';
import FaviconService from 'soapbox/utils/favicon_service';

FaviconService.initFaviconService();

const getNotifTotals = (state: any): number => {
  const notifications = state.getIn(['notifications', 'unread'], 0);
  const chats = state.getIn(['chats', 'items']).reduce((acc: any, curr: any) => acc + Math.min(curr.get('unread', 0), 1), 0);
  const reports = state.getIn(['admin', 'openReports']).count();
  const approvals = state.getIn(['admin', 'awaitingApproval']).count();
  return notifications + chats + reports + approvals;
};

const Helmet: React.FC = ({ children }) => {
  const title = useAppSelector((state) => state.instance.title);
  const unreadCount = useAppSelector((state) => getNotifTotals(state));
  const demetricator = useSettings().get('demetricator');

  const hasUnreadNotifications = React.useMemo(() => !(unreadCount < 1 || demetricator), [unreadCount, demetricator]);

  const addCounter = (string: string) => {
    return hasUnreadNotifications ? `(${unreadCount}) ${string}` : string;
  };

  const updateFaviconBadge = () => {
    if (hasUnreadNotifications) {
      FaviconService.drawFaviconBadge();
    } else {
      FaviconService.clearFaviconBadge();
    }
  };

  React.useEffect(() => {
    updateFaviconBadge();
  }, [unreadCount, demetricator]);

  return (
    <ReactHelmet
      titleTemplate={addCounter(`%s | ${title}`)}
      defaultTitle={addCounter(title)}
      defer={false}
    >
      {children}
    </ReactHelmet>
  );
};

export default Helmet;
