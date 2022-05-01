import { Map as ImmutableMap } from 'immutable';
import * as React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { Widget } from 'soapbox/components/ui';
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

  // FIXME: This page actually doesn't look good right now
  // const handleAction = () => {
  //   history.push('/suggestions');
  // };

  return (
    <Widget
      title={<FormattedMessage id='who_to_follow.title' defaultMessage='People To Follow' />}
      // onAction={handleAction}
    >
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
    </Widget>
  );
};

export default WhoToFollowPanel;
