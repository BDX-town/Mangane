import React from 'react';
import { useEffect } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';

import { deleteList, fetchLists } from 'soapbox/actions/lists';
import { openModal } from 'soapbox/actions/modals';
import Icon from 'soapbox/components/icon';
import ScrollableList from 'soapbox/components/scrollable_list';
import { IconButton, Spinner } from 'soapbox/components/ui';
import { CardHeader, CardTitle } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import Column from '../ui/components/column';

import NewListForm from './components/new_list_form';

import type { RootState } from 'soapbox/store';

const messages = defineMessages({
  heading: { id: 'column.lists', defaultMessage: 'Lists' },
  subheading: { id: 'lists.subheading', defaultMessage: 'Your lists' },
  add: { id: 'lists.new.create', defaultMessage: 'Add list' },
  deleteHeading: { id: 'confirmations.delete_list.heading', defaultMessage: 'Delete list' },
  deleteMessage: { id: 'confirmations.delete_list.message', defaultMessage: 'Are you sure you want to permanently delete this list?' },
  deleteConfirm: { id: 'confirmations.delete_list.confirm', defaultMessage: 'Delete' },
  editList: { id: 'lists.edit', defaultMessage: 'Edit list' },
  deleteList: { id: 'lists.delete', defaultMessage: 'Delete list' },
});

const getOrderedLists = createSelector([(state: RootState) => state.lists], lists => {
  if (!lists) {
    return lists;
  }

  return lists.toList().filter((item) => !!item).sort((a: any, b: any) => a.get('title').localeCompare(b.get('title')));
});

const Lists: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const lists = useAppSelector((state) => getOrderedLists(state));

  useEffect(() => {
    dispatch(fetchLists());
  }, []);

  if (!lists) {
    return (
      <Column>
        <Spinner />
      </Column>
    );
  }

  const handleEditClick = (id: number) => (e: React.MouseEvent) => {
    e.preventDefault();

    dispatch(openModal('LIST_EDITOR', { listId: id }));
  };

  const handleDeleteClick = (id: number) => (e: React.MouseEvent) => {
    e.preventDefault();

    dispatch(openModal('CONFIRM', {
      heading: intl.formatMessage(messages.deleteHeading),
      message: intl.formatMessage(messages.deleteMessage),
      confirm: intl.formatMessage(messages.deleteConfirm),
      onConfirm: () => {
        dispatch(deleteList(id));
      },
    }));
  };

  const emptyMessage = <FormattedMessage id='empty_column.lists' defaultMessage="You don't have any lists yet. When you create one, it will show up here." />;

  return (
    <Column icon='list-ul' label={intl.formatMessage(messages.heading)}>
      <br />
      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.add)} />
      </CardHeader>
      <NewListForm />
      <br />
      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.subheading)} />
      </CardHeader>
      <ScrollableList
        scrollKey='lists'
        emptyMessage={emptyMessage}
        itemClassName='py-2'
      >
        {lists.map((list: any) => (
          <Link key={list.get('id')} to={`/list/${list.get('id')}`} className='flex items-center gap-1.5 p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg'>
            <Icon src={require('@tabler/icons/icons/list.svg')} fixedWidth />
            <span className='flex-grow'>
              {list.get('title')}
            </span>
            <IconButton iconClassName='h-5 w-5' src={require('@tabler/icons/icons/pencil.svg')} onClick={handleEditClick(list.get('id'))} title={intl.formatMessage(messages.editList)} />
            <IconButton iconClassName='h-5 w-5' src={require('@tabler/icons/icons/trash.svg')} onClick={handleDeleteClick(list.get('id'))} title={intl.formatMessage(messages.deleteList)} />
          </Link>
        ))}
      </ScrollableList>
    </Column>
  );
};

export default Lists;
