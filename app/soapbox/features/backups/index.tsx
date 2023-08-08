import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { fetchBackups, createBackup } from 'soapbox/actions/backups';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Button, FormActions, Text, Spinner } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import Column from '../ui/components/better_column';

const messages = defineMessages({
  heading: { id: 'column.backups', defaultMessage: 'Backups' },
  create: { id: 'backups.actions.create', defaultMessage: 'Create backup' },
  emptyMessage: { id: 'backups.empty_message', defaultMessage: 'No backups found. {action}' },
  emptyMessageAction: { id: 'backups.empty_message.action', defaultMessage: 'Create one now?' },
  pending: { id: 'backups.pending', defaultMessage: 'Pending' },
});

const Backups = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const backups = useAppSelector((state) => state.backups.toList().sortBy((backup) => backup.inserted_at));

  const [isLoading, setIsLoading] = useState(true);

  const handleCreateBackup: React.MouseEventHandler = e => {
    dispatch(createBackup());
    e.preventDefault();
  };

  useEffect(() => {
    dispatch(fetchBackups()).then(() => {
      setIsLoading(false);
    }).catch(() => {});
  }, []);

  const showLoading = isLoading && backups.count() === 0;

  const emptyMessageAction = (
    <a href='#' onClick={handleCreateBackup}>
      <Text tag='span' theme='primary' size='sm' className='hover:underline'>
        {intl.formatMessage(messages.emptyMessageAction)}
      </Text>
    </a>
  );

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        isLoading={isLoading}
        showLoading={showLoading}
        scrollKey='backups'
        emptyMessage={intl.formatMessage(messages.emptyMessage, { action: emptyMessageAction })}
      >
        {backups.map((backup) => {
          const insertedAt = new Date(backup.inserted_at).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
          return (
            <div
              className='p-2 mb-3 rounded bg-gray-100 dark:bg-slate-900 flex justify-between items-center'
              key={backup.id}
            >
              <div>
                {backup.processed
                  ? <a href={backup.url} target='_blank'>{insertedAt}</a>
                  : <Text theme='subtle'>{insertedAt}&nbsp;-&nbsp;{intl.formatMessage(messages.pending)}</Text>
                }
              </div>
              {
                !backup.processed && <Spinner withText={false} size={15} />
              }
            </div>
          );
        })}
      </ScrollableList>
      <div className='mt-4'>
        <FormActions>
          <Button theme='primary' disabled={isLoading} onClick={handleCreateBackup}>
            {intl.formatMessage(messages.create)}
          </Button>
        </FormActions>
      </div>
    </Column>
  );
};

export default Backups;
