import { Map as ImmutableMap } from 'immutable';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { Button, Card, CardBody, Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppSelector } from 'soapbox/hooks';

import { fetchSuggestions } from '../../../actions/suggestions';

const SuggestedAccountsStep = ({ onNext }: { onNext: () => void }) => {
  const dispatch = useDispatch();

  const suggestions = useAppSelector((state) => state.suggestions.get('items'));
  const suggestionsToRender = suggestions.slice(0, 5);

  React.useEffect(() => {
    dispatch(fetchSuggestions());
  }, []);

  const renderSuggestions = () => {
    return (
      <div className='sm:pt-4 sm:pb-10 flex flex-col divide-y divide-solid divide-gray-200 dark:divide-slate-700'>
        {suggestionsToRender.map((suggestion: ImmutableMap<string, any>) => (
          <div key={suggestion.get('account')} className='py-2'>
            <AccountContainer
              // @ts-ignore: TS thinks `id` is passed to <Account>, but it isn't
              id={suggestion.get('account')}
              showProfileHoverCard={false}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderEmpty = () => {
    return (
      <div className='bg-primary-50 dark:bg-slate-700 my-2 rounded-lg text-center p-8'>
        <Text>
          <FormattedMessage id='empty_column.follow_recommendations' defaultMessage='Looks like no suggestions could be generated for you. You can try using search to look for people you might know or explore trending hashtags.' />
        </Text>
      </div>
    );
  };

  const renderBody = () => {
    if (suggestionsToRender.isEmpty()) {
      return renderEmpty();
    } else {
      return renderSuggestions();
    }
  };

  return (
    <Card variant='rounded' size='xl'>
      <CardBody>
        <div>
          <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
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

                <Button block theme='link' type='button' onClick={onNext}>
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
