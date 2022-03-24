import { Map as ImmutableMap } from 'immutable';
import * as React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { Stack, Text } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import { fetchSuggestions, dismissSuggestion } from '../../../actions/suggestions';
import AccountContainer from '../../../containers/account_container';

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
});

interface IWhoToFollowPanel {
  limit: number
}

const WhoToFollowPanel = ({ limit }: IWhoToFollowPanel) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const suggestions = useAppSelector((state) => state.suggestions.get('items'));
  const suggestionsToRender = suggestions.slice(0, limit);

  const handleDismiss = (account: ImmutableMap<string, any>) => {
    dispatch(dismissSuggestion(account.get('id')));
  };

  React.useEffect(() => {
    dispatch(fetchSuggestions());
  }, []);

  if (suggestionsToRender.isEmpty()) {
    return null;
  }

  return (
    <Stack space={2}>
      <Text size='xl' weight='bold'>
        <FormattedMessage id='who_to_follow.title' defaultMessage='People To Follow' />
      </Text>

      <Stack space={3}>
        {suggestionsToRender.map((suggestion: ImmutableMap<string, any>) => (
          <AccountContainer
            key={suggestion.get('account')}
            // @ts-ignore: TS thinks `id` is passed to <Account>, but it isn't
            id={suggestion.get('account')}
            actionIcon={require('@tabler/icons/icons/x.svg')}
            actionTitle={intl.formatMessage(messages.dismissSuggestion)}
            onActionClick={handleDismiss}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default WhoToFollowPanel;
