import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { filterConversationsByRecipients } from 'soapbox/actions/conversations';
import AccountSearch from 'soapbox/components/account_search';
import { Avatar, HStack, Icon, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const messages = defineMessages({
  placeholder: { id: 'conversations.search_placeholder', defaultMessage: 'Filtrer par participant…' },
  remove: { id: 'conversations.search_remove', defaultMessage: 'Retirer {name} du filtre' },
});

const getAccount = makeGetAccount();

const ConversationsSearch: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [accountIds, setAccountIds] = useState<string[]>([]);

  // Only used to render the chips below; the filter itself is keyed off `accountIds`.
  const accounts = useAppSelector((state) => (
    accountIds.map(id => getAccount(state, id)).filter(account => !!account)
  ));

  useEffect(() => {
    dispatch(filterConversationsByRecipients(accountIds));
  }, [accountIds, dispatch]);

  useEffect(() => () => {
    dispatch(filterConversationsByRecipients([]));
  }, [dispatch]);

  const handleSelected = useCallback((accountId: string) => {
    setAccountIds(ids => ids.includes(accountId) ? ids : [...ids, accountId]);
  }, []);

  const handleRemove = useCallback((accountId: string) => {
    setAccountIds(ids => ids.filter(id => id !== accountId));
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <AccountSearch onSelected={handleSelected} placeholder={intl.formatMessage(messages.placeholder)} />

      {accounts.length > 0 && (
        <HStack space={2} className='flex-wrap'>
          {accounts.map(account => (
            <HStack
              key={account!.id}
              space={1}
              alignItems='center'
              className='bg-white dark:bg-slate-800 rounded-full px-2 py-1 border border-solid border-gray-300 dark:border-gray-600 '
            >
              <Avatar src={account!.avatar} size={20} />
              <Text size='sm' weight='medium'>{account!.display_name}</Text>
              <button
                type='button'
                onClick={() => handleRemove(account!.id)}
                aria-label={intl.formatMessage(messages.remove, { name: account!.display_name })}
              >
                <Icon src={require('@tabler/icons/x.svg')} className='h-4 w-4' />
              </button>
            </HStack>
          ))}
        </HStack>
      )}
    </div>
  );
};

export default ConversationsSearch;
