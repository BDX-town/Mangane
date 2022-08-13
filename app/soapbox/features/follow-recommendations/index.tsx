import debounce from 'lodash/debounce';
import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchSuggestions } from 'soapbox/actions/suggestions';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import Column from 'soapbox/features/ui/components/column';
import { useAppDispatch, useAppSelector, useFeatures } from 'soapbox/hooks';

const messages = defineMessages({
  heading: { id: 'followRecommendations.heading', defaultMessage: 'Suggested profiles' },
});

const FollowRecommendations: React.FC = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const features = useFeatures();

  const suggestions = useAppSelector((state) => state.suggestions.items);
  const hasMore = useAppSelector((state) => !!state.suggestions.next);
  const isLoading = useAppSelector((state) => state.suggestions.isLoading);

  const handleLoadMore = debounce(() => {
    if (isLoading) {
      return null;
    }

    return dispatch(fetchSuggestions({ limit: 20 }));
  }, 300);

  useEffect(() => {
    dispatch(fetchSuggestions({ limit: 20 }));
  }, []);

  if (suggestions.size === 0 && !isLoading) {
    return (
      <Column label={intl.formatMessage(messages.heading)}>
        <Text align='center'>
          <FormattedMessage id='empty_column.follow_recommendations' defaultMessage='Looks like no suggestions could be generated for you. You can try using search to look for people you might know or explore trending hashtags.' />
        </Text>
      </Column>
    );
  }

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <Stack space={4}>
        <ScrollableList
          isLoading={isLoading}
          scrollKey='suggestions'
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          itemClassName='pb-4'
        >
          {features.truthSuggestions ? (
            suggestions.map((suggestedProfile) => (
              <AccountContainer
                key={suggestedProfile.account}
                id={suggestedProfile.account}
                withAccountNote
                showProfileHoverCard={false}
                actionAlignment='top'
              />
            ))
          ) : (
            suggestions.map((suggestion) => (
              <AccountContainer
                key={suggestion.account}
                id={suggestion.account}
                withAccountNote
              />
            ))
          )}
        </ScrollableList>
      </Stack>
    </Column>
  );
};

export default FollowRecommendations;
