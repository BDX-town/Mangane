import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchTags, followTag, unfollowTag } from 'soapbox/actions/tags';
import Icon from 'soapbox/components/icon';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Button, Column, IconButton, Spinner, Text } from 'soapbox/components/ui';
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
    <IconButton className='mx-3' style={{ background: 'transparent' }} onClick={onClick} src={isFollow ? require('@tabler/icons/minus.svg') : require('@tabler/icons/plus.svg')} text={text} />
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
    <Column label={intl.formatMessage(messages.heading)}>
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
                <div className='p-1 bg-gray-100 dark:bg-slate-900 rounded flex flex-wrap justify-between items-center'>
                  <div className='flex items-center grow'>
                    <Icon src={require('@tabler/icons/hash.svg')} />
                    <Text tag='span' weight='semibold'>
                      { tag.name }
                    </Text>
                  </div>
                  <div className='flex items-center gap-3 grow shrink justify-end'>
                    <FollowButton id={tag.name} />
                    <span className='dark:text-slate-800 text-gray-300' >|</span>
                    <Button theme='link' to={`/tag/${tag.name}`}>
                      <div className='flex items-center'>
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
