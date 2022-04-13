import React from 'react';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { fetchList } from 'soapbox/actions/lists';
import { openModal } from 'soapbox/actions/modals';
import { connectListStream } from 'soapbox/actions/streaming';
import { expandListTimeline } from 'soapbox/actions/timelines';
import MissingIndicator from 'soapbox/components/missing_indicator';
import { Button, Spinner } from 'soapbox/components/ui';
import Column from 'soapbox/features/ui/components/column';
import { useAppSelector } from 'soapbox/hooks';

import StatusListContainer from '../ui/containers/status_list_container';

// const messages = defineMessages({
//   deleteHeading: { id: 'confirmations.delete_list.heading', defaultMessage: 'Delete list' },
//   deleteMessage: { id: 'confirmations.delete_list.message', defaultMessage: 'Are you sure you want to permanently delete this list?' },
//   deleteConfirm: { id: 'confirmations.delete_list.confirm', defaultMessage: 'Delete' },
// });

const ListTimeline: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  // const intl = useIntl();
  // const history = useHistory();

  const list = useAppSelector((state) => state.lists.get(id));
  // const hasUnread = useAppSelector((state) => state.timelines.getIn([`list:${props.params.id}`, 'unread']) > 0);

  useEffect(() => {
    const disconnect = handleConnect(id);

    return () => {
      disconnect();
    };
  }, [id]);

  const handleConnect = (id: string) => {
    dispatch(fetchList(id));
    dispatch(expandListTimeline(id));

    return dispatch(connectListStream(id));
  };

  const handleLoadMore = (maxId: string) => {
    dispatch(expandListTimeline(id, { maxId }));
  };

  const handleEditClick = () => {
    dispatch(openModal('LIST_EDITOR', { listId: id }));
  };

  // const handleDeleteClick = () => {
  //   dispatch(openModal('CONFIRM', {
  //     icon: require('@tabler/icons/icons/trash.svg'),
  //     heading: intl.formatMessage(messages.deleteHeading),
  //     message: intl.formatMessage(messages.deleteMessage),
  //     confirm: intl.formatMessage(messages.deleteConfirm),
  //     onConfirm: () => {
  //       dispatch(deleteList(id));
  //       history.push('/lists');
  //     },
  //   }));
  // };

  const title  = list ? list.get('title') : id;

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
    <Column label={title} heading={title} transparent>
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

      <StatusListContainer
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
