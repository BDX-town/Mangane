import isEqual from 'lodash/isEqual';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import { connectHashtagStream } from '../../actions/streaming';
import { expandHashtagTimeline, clearTimeline } from '../../actions/timelines';
import ColumnHeader from '../../components/column_header';
import { Column } from '../../components/ui';
import Timeline from '../ui/components/timeline';


const HashtagTimeline: React.FC = () => {
  const dispatch = useAppDispatch();
  const disconnects = React.useRef([]);
  const { id, tags } = useParams<{ id: string, tags: any }>();
  const prevParams = React.useRef({ id, tags });

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
        <ColumnHeader active={hasUnread} title={title} />
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