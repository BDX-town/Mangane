import React from 'react';

import { cancelQuoteCompose } from 'soapbox/actions/compose';
import QuotedStatus from 'soapbox/components/quoted-status';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetStatus } from 'soapbox/selectors';

const getStatus = makeGetStatus();

/** QuotedStatus shown in post composer. */
const QuotedStatusContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => getStatus(state, { id: state.compose.quote! }));

  const onCancel = () => {
    dispatch(cancelQuoteCompose());
  };

  if (!status) {
    return null;
  }

  return (
    <div className='mb-2'>
      <QuotedStatus
        status={status}
        onCancel={onCancel}
        compose
      />
    </div>
  );
};

export default QuotedStatusContainer;
