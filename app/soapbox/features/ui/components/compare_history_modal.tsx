import React, { useEffect } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { fetchHistory } from 'soapbox/actions/history';
import { Modal, Spinner, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

interface ICompareHistoryModal {
  onClose: (string: string) => void,
  statusId: string,
}

const CompareHistoryModal: React.FC<ICompareHistoryModal> = ({ onClose, statusId }) => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(state => state.history.getIn([statusId, 'loading']));
  const versions = useAppSelector<any>(state => state.history.getIn([statusId, 'items']));

  const onClickClose = () => {
    onClose('COMPARE_HISTORY');
  };

  useEffect(() => {
    dispatch(fetchHistory(statusId));
  }, [statusId]);

  let body;

  if (loading) {
    body = <Spinner />;
  } else {
    body = (
      <div className='divide-y divide-solid divide-gray-200 dark:divide-slate-700'>
        {versions?.map((version: any) => {
          const content = { __html: version.contentHtml };
          const spoilerContent = { __html: version.spoilerHtml };

          return (
            <div className='flex flex-col py-2 first:pt-0 last:pb-0'>
              {version.spoiler_text?.length > 0 && (
                <>
                  <span dangerouslySetInnerHTML={spoilerContent} />
                  <hr />
                </>
              )}
              <div className='status__content' dangerouslySetInnerHTML={content} />
              <Text align='right' tag='span' theme='muted' size='sm'>
                <FormattedDate value={new Date(version.created_at)} hour12={false} year='numeric' month='short' day='2-digit' hour='2-digit' minute='2-digit' />
              </Text>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Modal
      title={<FormattedMessage id='compare_history_modal.header' defaultMessage='Edit history' />}
      onClose={onClickClose}
    >
      {body}
    </Modal>
  );
};

export default CompareHistoryModal;
