import { List as ImmutableList } from 'immutable';
import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchAliases, removeFromAliases } from 'soapbox/actions/aliases';
import Icon from 'soapbox/components/icon';
import ScrollableList from 'soapbox/components/scrollable_list';
import { CardHeader, CardTitle, Column, HStack, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';
import { getFeatures } from 'soapbox/utils/features';

import Account from './components/account';
import Search from './components/search';

const messages = defineMessages({
  heading: { id: 'column.aliases', defaultMessage: 'Account aliases' },
  subheading_add_new: { id: 'column.aliases.subheading_add_new', defaultMessage: 'Add New Alias' },
  create_error: { id: 'column.aliases.create_error', defaultMessage: 'Error creating alias' },
  delete_error: { id: 'column.aliases.delete_error', defaultMessage: 'Error deleting alias' },
  subheading_aliases: { id: 'column.aliases.subheading_aliases', defaultMessage: 'Current aliases' },
  delete: { id: 'column.aliases.delete', defaultMessage: 'Delete' },
});

const getAccount = makeGetAccount();

const Aliases = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const aliases = useAppSelector((state) => {
    const me = state.me as string;
    const account = getAccount(state, me);

    const instance = state.instance;
    const features = getFeatures(instance);

    if (features.accountMoving) return state.aliases.aliases.items;
    return account!.pleroma.get('also_known_as');
  }) as ImmutableList<string>;
  const searchAccountIds = useAppSelector((state) => state.aliases.suggestions.items);
  const loaded = useAppSelector((state) => state.aliases.suggestions.loaded);

  useEffect(() => {
    dispatch(fetchAliases);
  }, []);

  const handleFilterDelete: React.MouseEventHandler<HTMLDivElement> = e => {
    dispatch(removeFromAliases(e.currentTarget.dataset.value as string));
  };

  const emptyMessage = <FormattedMessage id='empty_column.aliases' defaultMessage="You haven't created any account alias yet." />;

  return (
    <Column className='aliases-settings-panel' label={intl.formatMessage(messages.heading)}>
      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.subheading_add_new)} />
      </CardHeader>
      <Search />
      {
        loaded && searchAccountIds.size === 0 ? (
          <div className='aliases__accounts empty-column-indicator'>
            <FormattedMessage id='empty_column.aliases.suggestions' defaultMessage='There are no account suggestions available for the provided term.' />
          </div>
        ) : (
          <div className='aliases__accounts'>
            {searchAccountIds.map(accountId => <Account key={accountId} accountId={accountId} aliases={aliases} />)}
          </div>
        )
      }
      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.subheading_aliases)} />
      </CardHeader>
      <div className='aliases-settings-panel'>
        <ScrollableList
          scrollKey='aliases'
          emptyMessage={emptyMessage}
        >
          {aliases.map((alias, i) => (
            <HStack alignItems='center' justifyContent='between' space={1} key={i} className='p-2'>
              <div>
                <Text tag='span' theme='muted'><FormattedMessage id='aliases.account_label' defaultMessage='Old account:' /></Text>
                {' '}
                <Text tag='span'>{alias}</Text>
              </div>
              <div className='flex items-center' role='button' tabIndex={0} onClick={handleFilterDelete} data-value={alias} aria-label={intl.formatMessage(messages.delete)}>
                <Icon className='mr-1.5' src={require('@tabler/icons/x.svg')} />
                <Text weight='bold' theme='muted'><FormattedMessage id='aliases.aliases_list_delete' defaultMessage='Unlink alias' /></Text>
              </div>
            </HStack>
          ))}
        </ScrollableList>
      </div>
    </Column>
  );
};

export default Aliases;
