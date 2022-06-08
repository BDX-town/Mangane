import React from 'react';

import QuotedStatus from 'soapbox/components/quoted-status';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetStatus } from 'soapbox/selectors';

const getStatus = makeGetStatus();

interface IQuotedStatusContainer {
  /** Status ID to the quoted status. */
  statusId: string,
}

const QuotedStatusContainer: React.FC<IQuotedStatusContainer> = ({ statusId }) => {
  const status = useAppSelector(state => getStatus(state, { id: statusId }));

  if (!status) {
    return null;
  }

  return (
    <QuotedStatus
      status={status}
    />
  );
};

export default QuotedStatusContainer;
