import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { fetchReblogs } from 'soapbox/actions/interactions';
import { fetchStatus } from 'soapbox/actions/statuses';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Modal, Spinner } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

interface IReblogsModal {
  onClose: (string: string) => void,
  statusId: string,
}

const ReblogsModal: React.FC<IReblogsModal> = ({ onClose, statusId }) => {
  const dispatch = useAppDispatch();
  const accountIds = useAppSelector((state) => state.user_lists.reblogged_by.get(statusId)?.items);

  const fetchData = () => {
    dispatch(fetchReblogs(statusId));
    dispatch(fetchStatus(statusId));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onClickClose = () => {
    onClose('REBLOGS');
  };

  let body;

  if (!accountIds) {
    body = <Spinner />;
  } else {
    const emptyMessage = <FormattedMessage id='status.reblogs.empty' defaultMessage='No one has reposted this post yet. When someone does, they will show up here.' />;

    body = (
      <ScrollableList
        scrollKey='reblogs'
        emptyMessage={emptyMessage}
        itemClassName='pb-3'
      >
        {accountIds.map((id) =>
          <AccountContainer key={id} id={id} />,
        )}
      </ScrollableList>
    );
  }

  return (
    <Modal
      title={<FormattedMessage id='column.reblogs' defaultMessage='Reposts' />}
      onClose={onClickClose}
    >
      {body}
    </Modal>
  );
};

export default ReblogsModal;
