import { List as ImmutableList } from 'immutable';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { fetchAliases, removeFromAliases } from 'soapbox/actions/aliases';
import Icon from 'soapbox/components/icon';
import ScrollableList from 'soapbox/components/scrollable_list';
import { makeGetAccount } from 'soapbox/selectors';
import { getFeatures } from 'soapbox/utils/features';

import Column from '../ui/components/column';
import ColumnSubheading from '../ui/components/column_subheading';

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
        <ColumnSubheading text={intl.formatMessage(messages.subheading_add_new)} />
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
        <ColumnSubheading text={intl.formatMessage(messages.subheading_aliases)} />
        <div className='aliases-settings-panel'>
          <ScrollableList
            scrollKey='aliases'
            emptyMessage={emptyMessage}
          >
            {aliases.map((alias, i) => (
              <div key={i} className='alias__container'>
                <div className='alias__details'>
                  <span className='alias__list-label'><FormattedMessage id='aliases.account_label' defaultMessage='Old account:' /></span>
                  <span className='alias__list-value'>{alias}</span>
                </div>
                <div className='alias__delete' role='button' tabIndex='0' onClick={this.handleFilterDelete} data-value={alias} aria-label={intl.formatMessage(messages.delete)}>
                  <Icon className='alias__delete-icon' id='times' size={40} />
                  <span className='alias__delete-label'><FormattedMessage id='aliases.aliases_list_delete' defaultMessage='Unlink alias' /></span>
                </div>
              </div>
            ))}
          </ScrollableList>
        </div>
      </Column>
    );
  }

}
