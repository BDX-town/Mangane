import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { fetchBackups, createBackup } from 'soapbox/actions/backups';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Button, FormActions, Text } from 'soapbox/components/ui';
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
        {backups.map((backup) => (
          <div
            className='p-4'
            key={backup.id}
          >
            {backup.processed
              ? <a href={backup.url} target='_blank'>{backup.inserted_at}</a>
              : <Text theme='subtle'>{intl.formatMessage(messages.pending)}: {backup.inserted_at}</Text>
            }
          </div>
        ))}
      </ScrollableList>

      <FormActions>
        <Button theme='primary' disabled={isLoading} onClick={handleCreateBackup}>
          {intl.formatMessage(messages.create)}
        </Button>
      </FormActions>
    </Column>
  );
};

export default Backups;
