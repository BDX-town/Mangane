import { List as ImmutableList } from 'immutable';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { fetchAliases, removeFromAliases } from 'soapbox/actions/aliases';
import Icon from 'soapbox/components/icon';
import ScrollableList from 'soapbox/components/scrollable_list';
import { CardHeader, CardTitle, Column, HStack, Text } from 'soapbox/components/ui';
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

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = state => {
    const me = state.get('me');
    const account = getAccount(state, me);

    const instance = state.get('instance');
    const features = getFeatures(instance);

    let aliases;

    if (features.accountMoving) aliases = state.getIn(['aliases', 'aliases', 'items'], ImmutableList());
    else aliases = account.getIn(['pleroma', 'also_known_as']);

    return {
      aliases,
      searchAccountIds: state.getIn(['aliases', 'suggestions', 'items']),
      loaded: state.getIn(['aliases', 'suggestions', 'loaded']),
    };
  };

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@injectIntl
class Aliases extends ImmutablePureComponent {

  componentDidMount = e => {
    const { dispatch } = this.props;
    dispatch(fetchAliases);
  }

  handleFilterDelete = e => {
    const { dispatch, intl } = this.props;
    dispatch(removeFromAliases(intl, e.currentTarget.dataset.value));
  }

  render() {
    const { intl, aliases, searchAccountIds, loaded } = this.props;

    const emptyMessage = <FormattedMessage id='empty_column.aliases' defaultMessage="You haven't created any account alias yet." />;

    return (
      <Column className='aliases-settings-panel' icon='suitcase' label={intl.formatMessage(messages.heading)}>
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
                <div className='flex items-center' role='button' tabIndex='0' onClick={this.handleFilterDelete} data-value={alias} aria-label={intl.formatMessage(messages.delete)}>
                  <Icon className='pr-1.5 text-lg' id='times' size={40} />
                  <Text weight='bold' theme='muted'><FormattedMessage id='aliases.aliases_list_delete' defaultMessage='Unlink alias' /></Text>
                </div>
              </HStack>
            ))}
          </ScrollableList>
        </div>
      </Column>
    );
  }

}
