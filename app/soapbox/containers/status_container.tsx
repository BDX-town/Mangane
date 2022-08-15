import React from 'react';

import Status, { IStatus } from 'soapbox/components/status';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetStatus } from 'soapbox/selectors';

interface IStatusContainer extends Omit<IStatus, 'status'> {
  id: string,
  /** @deprecated Unused. */
  contextType?: any,
  /** @deprecated Unused. */
  otherAccounts?: any,
  /** @deprecated Unused. */
  getScrollPosition?: any,
  /** @deprecated Unused. */
  updateScrollBottom?: any,
}

const getStatus = makeGetStatus();

/**
 * Legacy Status wrapper accepting a status ID instead of the full entity.
 * @deprecated Use the Status component directly.
 */
const StatusContainer: React.FC<IStatusContainer> = (props) => {
  const { id, ...rest } = props;
  const status = useAppSelector(state => getStatus(state, { id }));

  if (status) {
    return <Status status={status} {...rest} />;
  } else {
    return null;
  }
};

export default StatusContainer;
