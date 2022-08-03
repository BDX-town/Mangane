import debounce from 'lodash/debounce';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { fetchSuggestions } from 'soapbox/actions/suggestions';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Button, Card, CardBody, Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppSelector } from 'soapbox/hooks';

const SuggestedAccountsStep = ({ onNext }: { onNext: () => void }) => {
  const dispatch = useDispatch();

  const suggestions = useAppSelector((state) => state.suggestions.items);
  const hasMore = useAppSelector((state) => !!state.suggestions.next);
  const isLoading = useAppSelector((state) => state.suggestions.isLoading);

  const handleLoadMore = debounce(() => {
    if (isLoading) {
      return null;
    }

    return dispatch(fetchSuggestions());
  }, 300);

  React.useEffect(() => {
    dispatch(fetchSuggestions({ limit: 20 }));
  }, []);

  const renderSuggestions = () => {
    return (
      <div className='sm:pt-4 sm:pb-10 flex flex-col'>
        <ScrollableList
          isLoading={isLoading}
          scrollKey='suggestions'
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          useWindowScroll={false}
          style={{ height: 320 }}
        >
          {suggestions.map((suggestion) => (
            <div key={suggestion.account} className='py-2'>
              <AccountContainer
                // @ts-ignore: TS thinks `id` is passed to <Account>, but it isn't
                id={suggestion.account}
                showProfileHoverCard={false}
                withLinkToProfile={false}
              />
            </div>
          ))}
        </ScrollableList>
      </div>
    );
  };

  const renderEmpty = () => {
    return (
      <div className='bg-primary-50 dark:bg-gray-800 my-2 rounded-lg text-center p-8'>
        <Text>
          <FormattedMessage id='empty_column.follow_recommendations' defaultMessage='Looks like no suggestions could be generated for you. You can try using search to look for people you might know or explore trending hashtags.' />
        </Text>
      </div>
    );
  };

  const renderBody = () => {
    if (suggestions.isEmpty()) {
      return renderEmpty();
    } else {
      return renderSuggestions();
    }
  };

  return (
    <Card variant='rounded' size='xl'>
      <CardBody>
        <div>
          <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-800 border-solid -mx-4 sm:-mx-10'>
            <Stack space={2}>
              <Text size='2xl' align='center' weight='bold'>
                <FormattedMessage id='onboarding.suggestions.title' defaultMessage='Suggested accounts' />
              </Text>

              <Text theme='muted' align='center'>
                <FormattedMessage id='onboarding.suggestions.subtitle' defaultMessage='Here are a few of the most popular accounts you might like.' />
              </Text>
            </Stack>
          </div>

          {renderBody()}

          <div className='sm:w-2/3 md:w-1/2 mx-auto'>
            <Stack>
              <Stack justifyContent='center' space={2}>
                <Button
                  block
                  theme='primary'
                  onClick={onNext}
                >
                  <FormattedMessage id='onboarding.done' defaultMessage='Done' />
                </Button>

                <Button block theme='tertiary' type='button' onClick={onNext}>
                  <FormattedMessage id='onboarding.skip' defaultMessage='Skip for now' />
                </Button>
              </Stack>
            </Stack>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SuggestedAccountsStep;
