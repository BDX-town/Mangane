import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import {
  fetchBackups,
  createBackup,
} from 'soapbox/actions/backups';
import ScrollableList from 'soapbox/components/scrollable_list';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import Column from '../ui/components/better_column';

import type { List as ImmutableList, Map as ImmutableMap } from 'immutable';

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

  const backups = useAppSelector<ImmutableList<ImmutableMap<string, any>>>((state) => state.backups.toList().sortBy((backup: ImmutableMap<string, any>) => backup.get('inserted_at')));

  const [isLoading, setIsLoading] = useState(true);

  const handleCreateBackup: React.MouseEventHandler<HTMLAnchorElement> = e => {
    dispatch(createBackup());
    e.preventDefault();
  };

  const makeColumnMenu = () => {
    return [{
      text: intl.formatMessage(messages.create),
      action: handleCreateBackup,
      icon: require('@tabler/icons/icons/plus.svg'),
    }];
  };

  useEffect(() => {
    dispatch(fetchBackups()).then(() => {
      setIsLoading(true);
    }).catch(() => {});
  }, []);

  const showLoading = isLoading && backups.count() === 0;

  const emptyMessageAction = (
    <a href='#' onClick={handleCreateBackup}>
      {intl.formatMessage(messages.emptyMessageAction)}
    </a>
  );

  return (
    <Column icon='cloud-download' label={intl.formatMessage(messages.heading)} menu={makeColumnMenu()}>
      <ScrollableList
        isLoading={isLoading}
        showLoading={showLoading}
        scrollKey='backups'
        emptyMessage={intl.formatMessage(messages.emptyMessage, { action: emptyMessageAction })}
      >
        {backups.map((backup) => (
          <div
            className={classNames('backup', { 'backup--pending': !backup.get('processed') })}
            key={backup.get('id')}
          >
            {backup.get('processed')
              ? <a href={backup.get('url')} target='_blank'>{backup.get('inserted_at')}</a>
              : <div>{intl.formatMessage(messages.pending)}: {backup.get('inserted_at')}</div>
            }
          </div>
        ))}
      </ScrollableList>
    </Column>
  );
};

export default Backups;
