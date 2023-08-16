import isEqual from 'lodash/isEqual';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { unfollowTag, followTag } from 'soapbox/actions/tags';
import Icon from 'soapbox/components/icon';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import { connectHashtagStream } from '../../actions/streaming';
import { expandHashtagTimeline, clearTimeline } from '../../actions/timelines';
import ColumnHeader from '../../components/column_header';
import { Button, Column, Spinner } from '../../components/ui';
import Timeline from '../ui/components/timeline';

interface IFollowButton {
  id: string,
}

const FollowButton: React.FC<IFollowButton> = ({ id }) => {
  const { isFollow, loading } = useAppSelector(state => ({ loading: state.tags.loading, isFollow: state.tags.list.find((t) => t.name.toLowerCase() === id.toLowerCase()) }));
  const dispatch = useAppDispatch();

  const onClick = React.useCallback(() => {
    const action = isFollow ? unfollowTag : followTag;
    dispatch(action(id));
  }, [isFollow, id]);

  const text = React.useMemo(() => {
    if (loading) return <FormattedMessage id='hashtag_timeline.loading' defaultMessage='Loading...' />;
    return isFollow ? (
      <FormattedMessage id='hashtag_timeline.unfollow' defaultMessage='Unfollow tag' />

    ) : (
      <FormattedMessage id='hashtag_timeline.follow' defaultMessage='Follow this tag' />
    );
  }, [loading, isFollow]);


  return (
    <Button disabled={loading} theme={isFollow ? 'secondary' : 'primary'} size='sm' onClick={onClick}>
      {
        loading ? <Spinner withText={false} size={16} /> : <Icon src={isFollow ? require('@tabler/icons/minus.svg') : require('@tabler/icons/plus.svg')} className='mr-1' />
      }
    &nbsp;
      {text}
    </Button>
  );
};


const HashtagTimeline: React.FC = () => {
  const dispatch = useAppDispatch();
  const disconnects = React.useRef([]);
  const { id, tags } = useParams<{ id: string, tags: any }>();
  const prevParams = React.useRef({ id, tags });
  const isLoggedIn = useAppSelector((state) => state.me);

  const hasUnread = useAppSelector((state) => (state.getIn(['timelines', `hashtag:${id}`, 'unread']) as number) > 0);

  // TODO: wtf is this?
  // It exists in Mastodon's codebase, but undocumented
  const additionalFor = React.useCallback((mode) => {
    if (tags && (tags[mode] || []).length > 0) {
      return tags[mode].map(tag => tag.value).join('/');
    } else {
      return '';
    }
  }, [tags]);


  const title = React.useMemo(() => {
    const t: React.ReactNode[] = [`#${id}`];

    // TODO: wtf is all this?
    // It exists in Mastodon's codebase, but undocumented
    if (additionalFor('any')) {
      t.push(' ', <FormattedMessage key='any' id='hashtag.column_header.tag_mode.any' values={{ additional: additionalFor('any') }} defaultMessage='or {additional}' />);
    }

    if (additionalFor('all')) {
      t.push(' ', <FormattedMessage key='all' id='hashtag.column_header.tag_mode.all' values={{ additional: additionalFor('all') }} defaultMessage='and {additional}' />);
    }

    if (additionalFor('none')) {
      t.push(' ', <FormattedMessage key='none' id='hashtag.column_header.tag_mode.none' values={{ additional: additionalFor('none') }} defaultMessage='without {additional}' />);
    }

    return t;
  }, [id, additionalFor]);


  const subscribe = React.useCallback((dispatch, _id, tags = {}) => {
    const any  = (tags.any || []).map(tag => tag.value);
    const all  = (tags.all || []).map(tag => tag.value);
    const none = (tags.none || []).map(tag => tag.value);

    [_id, ...any].map(tag => {
      disconnects.current.push(dispatch(connectHashtagStream(_id, tag, status => {
        const tags = status.tags.map(tag => tag.name);

        return all.filter(tag => tags.includes(tag)).length === all.length &&
               none.filter(tag => tags.includes(tag)).length === 0;
      })));
    });
  }, []);

  const unsubscribe = React.useCallback(() => {
    disconnects.current.map((d) => d());
    disconnects.current = [];
  }, []);

  React.useEffect(() => {
    const { id: prevId, tags: prevTags } = prevParams.current;
    if (id !== prevId || !isEqual(tags, prevTags)) {
      dispatch(clearTimeline(`hashtag:${id}`));
    }

    subscribe(dispatch, id, tags);
    dispatch(expandHashtagTimeline(id, { tags }));

    return () => {
      unsubscribe();
    };
  }, [dispatch, tags, id, subscribe, unsubscribe]);


  const handleLoadMore = React.useCallback((maxId) => {
    dispatch(expandHashtagTimeline(id, { maxId, tags }));
  }, [dispatch, id, tags]);


  return (
    <Column label={`#${id}`} transparent withHeader={false}>
      <div className='px-4 pt-4 sm:p-0'>
        <ColumnHeader
          active={hasUnread}
          title={
            <div className='flex justify-between items-center'>
              { title }
              {
                isLoggedIn && (
                  <FollowButton id={id} />
                )
              }
            </div>
          }
        />
      </div>
      <Timeline
        scrollKey='hashtag_timeline'
        timelineId={`hashtag:${id}`}
        onLoadMore={handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
        divideType='space'
      />
    </Column>
  );
};

export default HashtagTimeline;