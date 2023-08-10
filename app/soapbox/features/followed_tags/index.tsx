import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchFilters, createFilter, deleteFilter } from 'soapbox/actions/filters';
import snackbar from 'soapbox/actions/snackbar';
import { followTag, unfollowTag } from 'soapbox/actions/tags';
import Icon from 'soapbox/components/icon';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Button, CardHeader, CardTitle, Column, Form, FormActions, FormGroup, Input, Spinner, Text } from 'soapbox/components/ui';
import {
  FieldsGroup,
  Checkbox,
} from 'soapbox/features/forms';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  heading: { id: 'column.tags', defaultMessage: 'Followed hashtags' },
});

interface IFollowButton {
    id: string,
  }

const FollowButton: React.FC<IFollowButton> = ({ id }) => {
  const { isFollow, loading } = useAppSelector(state => ({ loading: state.tags.loading, isFollow: state.tags.list.find((t) => t.name === id) }));
  const dispatch = useAppDispatch();

  const onClick = React.useCallback(() => {
    const action = isFollow ? unfollowTag : followTag;
    dispatch(action(id));
  }, [isFollow, id]);

  const text = React.useMemo(() => {
    if (loading) return <FormattedMessage id='hashtag_timeline.loading' defaultMessage='Loading...' />;
    return isFollow ? (
      <FormattedMessage id='hashtag_timeline.unfollow' defaultMessage='Unfollow' />

    ) : (
      <FormattedMessage id='hashtag_timeline.follow' defaultMessage='Follow' />
    );
  }, [loading, isFollow]);


  return (
    <Button disabled={loading} theme='secondary' size='sm' onClick={onClick}>
      {
        loading ? <Spinner withText={false} size={16} /> : <Icon src={isFollow ? require('@tabler/icons/minus.svg') : require('@tabler/icons/plus.svg')} className='mr-1' />
      }
      &nbsp;
      {
        text
      }
    </Button>
  );
};

const FollowedHashtags = () => {
  const intl = useIntl();
  const [tags, setTags] = React.useState(null);

  const { tags: serverTags, loading } = useAppSelector((state) => ({ tags: state.tags.list, loading: state.tags.loading }));

  // we want to keep our own list to allow user to refollow instantly if unfollow was a mistake
  React.useEffect(() => {
    if (loading || tags) return;
    setTags(serverTags);
  }, [serverTags, tags, loading]);


  return (
    <Column label={intl.formatMessage(messages.heading)}>
      {
        !tags ? (
          <Spinner />
        ) : (
          <ScrollableList
            className='flex flex-col gap-3'
            scrollKey='followed_hashtags'
            emptyMessage={<FormattedMessage id='column.tags.empty' defaultMessage="You don't follow any hashtag yet." />}
          >
            {
              tags?.map((tag) => (
                <div className='p-2 dark:bg-slate-900 rounded flex justify-between items-center'>
                  <div className='flex items-center'>
                    <Icon src={require('@tabler/icons/hash.svg')} />
                    <Text tag='span' weight='semibold'>
                      { tag.name }
                    </Text>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FollowButton id={tag.name} />
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
