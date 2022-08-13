import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { fetchList } from 'soapbox/actions/lists';
import { openModal } from 'soapbox/actions/modals';
import { connectListStream } from 'soapbox/actions/streaming';
import { expandListTimeline } from 'soapbox/actions/timelines';
import MissingIndicator from 'soapbox/components/missing_indicator';
import { Button, Spinner } from 'soapbox/components/ui';
import Column from 'soapbox/features/ui/components/column';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import Timeline from '../ui/components/timeline';

// const messages = defineMessages({
//   deleteHeading: { id: 'confirmations.delete_list.heading', defaultMessage: 'Delete list' },
//   deleteMessage: { id: 'confirmations.delete_list.message', defaultMessage: 'Are you sure you want to permanently delete this list?' },
//   deleteConfirm: { id: 'confirmations.delete_list.confirm', defaultMessage: 'Delete' },
// });

const ListTimeline: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  // const intl = useIntl();
  // const history = useHistory();

  const list = useAppSelector((state) => state.lists.get(id));
  // const hasUnread = useAppSelector((state) => state.timelines.get(`list:${props.params.id}`)?.unread > 0);

  useEffect(() => {
    dispatch(fetchList(id));
    dispatch(expandListTimeline(id));

    const disconnect = dispatch(connectListStream(id));

    return () => {
      disconnect();
    };
  }, [id]);

  const handleLoadMore = (maxId: string) => {
    dispatch(expandListTimeline(id, { maxId }));
  };

  const handleEditClick = () => {
    dispatch(openModal('LIST_EDITOR', { listId: id }));
  };

  // const handleDeleteClick = () => {
  //   dispatch(openModal('CONFIRM', {
  //     icon: require('@tabler/icons/trash.svg'),
  //     heading: intl.formatMessage(messages.deleteHeading),
  //     message: intl.formatMessage(messages.deleteMessage),
  //     confirm: intl.formatMessage(messages.deleteConfirm),
  //     onConfirm: () => {
  //       dispatch(deleteList(id));
  //       history.push('/lists');
  //     },
  //   }));
  // };

  const title  = list ? list.title : id;

  if (typeof list === 'undefined') {
    return (
      <Column>
        <div>
          <Spinner />
        </div>
      </Column>
    );
  } else if (list === false) {
    return (
      <MissingIndicator />
    );
  }

  const emptyMessage = (
    <div>
      <FormattedMessage id='empty_column.list' defaultMessage='There is nothing in this list yet. When members of this list create new posts, they will appear here.' />
      <br /><br />
      <Button onClick={handleEditClick}><FormattedMessage id='list.click_to_add' defaultMessage='Click here to add people' /></Button>
    </div>
  );

  return (
    <Column label={title} heading={title} transparent withHeader={false}>
      {/* <HomeColumnHeader activeItem='lists' activeSubItem={id} active={hasUnread}>
        <div className='column-header__links'>
          <button className='text-btn column-header__setting-btn' tabIndex='0' onClick={handleEditClick}>
            <Icon id='pencil' /> <FormattedMessage id='lists.edit' defaultMessage='Edit list' />
          </button>

          <button className='text-btn column-header__setting-btn' tabIndex='0' onClick={handleDeleteClick}>
            <Icon id='trash' /> <FormattedMessage id='lists.delete' defaultMessage='Delete list' />
          </button>

          <hr />

          <Link to='/lists' className='text-btn column-header__setting-btn column-header__setting-btn--link'>
            <FormattedMessage id='lists.view_all' defaultMessage='View all lists' />
            <Icon id='arrow-right' />
          </Link>
        </div>
      </HomeColumnHeader> */}

      <Timeline
        scrollKey='list_timeline'
        timelineId={`list:${id}`}
        onLoadMore={handleLoadMore}
        emptyMessage={emptyMessage}
        divideType='space'
      />
    </Column>
  );
};

export default ListTimeline;
