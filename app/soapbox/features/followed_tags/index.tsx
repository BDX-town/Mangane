import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchTags, followTag, unfollowTag } from 'soapbox/actions/tags';
import Icon from 'soapbox/components/icon';
import ScrollableList from 'soapbox/components/scrollable_list';
import SubNavigation from 'soapbox/components/sub_navigation';
import { Button, Column, Spinner, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  heading: { id: 'column.tags', defaultMessage: 'Followed hashtags' },
});

interface IFollowButton {
    id: string,
  }

const FollowButton: React.FC<IFollowButton> = ({ id }) => {
  const { isFollow } = useAppSelector(state => ({ isFollow: state.tags.list.find((t) => t.name === id) }));
  const dispatch = useAppDispatch();

  const onClick = React.useCallback(() => {
    const action = isFollow ? unfollowTag : followTag;
    dispatch(action(id));
  }, [isFollow, id]);

  const text = React.useMemo(() => {
    return isFollow ? (
      <FormattedMessage id='hashtag_timeline.unfollow' defaultMessage='Unfollow' />

    ) : (
      <FormattedMessage id='hashtag_timeline.follow' defaultMessage='Follow' />
    );
  }, [isFollow]);


  return (
    <Button theme='ghost' classNames='text-xs gap-1 flex-row-reverse' style={{ background: 'transparent' }} onClick={onClick}>
      <Icon src={isFollow ? require('@tabler/icons/minus.svg') : require('@tabler/icons/plus.svg')} />
      {
        text
      }
    </Button>
  );
};

const FollowedHashtags = () => {
  const intl = useIntl();
  const [tags, setTags] = React.useState(null);
  const dispatch = useAppDispatch();

  const { tags: serverTags, loading } = useAppSelector((state) => ({ tags: state.tags.list, loading: state.tags.loading }));

  // we want to keep our own list to allow user to refollow instantly if unfollow was a mistake
  React.useEffect(() => {
    if (loading || tags) return;
    setTags(serverTags);
  }, [serverTags, tags, loading]);

  React.useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);


  return (
    <Column label={intl.formatMessage(messages.heading)} transparent withHeader={false}>
      <div className='px-4 pt-4 sm:p-0'>
        <SubNavigation message={intl.formatMessage(messages.heading)} />
      </div>
      {
        !tags ? (
          <Spinner />
        ) : (
          <ScrollableList
            className='flex flex-col gap-2'
            scrollKey='followed_hashtags'
            emptyMessage={<FormattedMessage id='column.tags.empty' defaultMessage="You don't follow any hashtag yet." />}
          >
            {
              tags?.map((tag) => (
                <div className='p-3 bg-white dark:bg-slate-800 shadow-sm dark:shadow-inset rounded-lg'>
                  <div className='flex items-center grow pl-2'>
                    <Text tag='span' weight='semibold'>
                      #{ tag.name }
                    </Text>
                  </div>
                  <hr className='bg-gray-100 dark:border-slate-800 mt-1 mb-2' />
                  <div className='flex items-center gap-1 grow shrink justify-between mt-1 text-sm'>
                    <FollowButton id={tag.name} />
                    <Button theme='primary' to={`/tag/${tag.name}`}>
                      <div className='flex items-center text-xs'>
                        <FormattedMessage id='column.tags.see' defaultMessage='See' />
                        &nbsp;
                        <Icon src={require('@tabler/icons/arrow-right.svg')} />
                      </div>
                    </Button>
                  </div>
                </div>
              ))
            }
          </ScrollableList>
        )
      }

    </Column>
  );
};

export default FollowedHashtags;
