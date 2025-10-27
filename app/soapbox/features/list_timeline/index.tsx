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
import SubNavigation from 'soapbox/components/sub_navigation';

const ListTimeline: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const list = useAppSelector((state) => state.lists.get(id));

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
    <Column label={title} transparent withHeader={false}>
      <div className='px-4 py-4 flex justify-between items-center'>
        <SubNavigation className='!mb-0' message={title} />
      </div>
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
