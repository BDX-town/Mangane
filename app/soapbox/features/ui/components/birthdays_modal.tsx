import React from 'react';
import { FormattedMessage } from 'react-intl';

import ScrollableList from 'soapbox/components/scrollable_list';
import { Modal, Spinner } from 'soapbox/components/ui';
import Account from 'soapbox/features/birthdays/account';
import { useAppSelector } from 'soapbox/hooks';

interface IBirthdaysModal {
  onClose: (string: string) => void,
}

const BirthdaysModal = ({ onClose }: IBirthdaysModal) => {
  const accountIds = useAppSelector<string[]>(state => state.user_lists.getIn(['birthday_reminders', state.me]));

  const onClickClose = () => {
    onClose('BIRTHDAYS');
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
        {accountIds.map(id =>
          <Account key={id} accountId={id} />,
        )}
      </ScrollableList>
    );
  }


  return (
    <Modal
      title={<FormattedMessage id='column.birthdays' defaultMessage='Birthdays' />}
      onClose={onClickClose}
    >
      {body}
    </Modal>
  );
};

export default BirthdaysModal;
