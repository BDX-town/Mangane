import React from 'react';
import { useEffect } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchLists } from 'soapbox/actions/lists';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Spinner } from 'soapbox/components/ui';
import { CardHeader, CardTitle } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import Column from '../ui/components/column';
import ColumnLink from '../ui/components/column_link';

import NewListForm from './components/new_list_form';

import type { RootState } from 'soapbox/store';

const messages = defineMessages({
  heading: { id: 'column.lists', defaultMessage: 'Lists' },
  subheading: { id: 'lists.subheading', defaultMessage: 'Your lists' },
  add: { id: 'lists.new.create', defaultMessage: 'Add list' },
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
      >
        {lists.map((list: any) =>
          <ColumnLink key={list.get('id')} to={`/list/${list.get('id')}`} src={require('@tabler/icons/icons/list.svg')} text={list.get('title')} />,
        )}
      </ScrollableList>
    </Column>
  );
};

export default Lists;
