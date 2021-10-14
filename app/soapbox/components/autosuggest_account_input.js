import React from 'react';
import AutosuggestInput from './autosuggest_input';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import { accountSearch } from 'soapbox/actions/accounts';
import { throttle } from 'lodash';

const noOp = () => {};

const messages = defineMessages({
  placeholder: { id: 'autosuggest_account_input.default_placeholder', defaultMessage: 'Search for an account' },
});

export default @connect()
@injectIntl
class AutosuggestAccountInput extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    onSelected: PropTypes.func.isRequired,
  }

  state = {
    text: '',
    accountIds: ImmutableOrderedSet(),
  }

  source = CancelToken.source();

  refreshCancelToken = () => {
    this.source.cancel();
    this.source = CancelToken.source();
    return this.source;
  }

  handleAccountSearch = throttle(q => {
    const { dispatch } = this.props;
    const source = this.refreshCancelToken();

    const params = {
      q,
      resolve: false,
      limit: 4,
    };

    dispatch(accountSearch(params, source.token))
      .then(accounts => {
        const accountIds = accounts.map(account => account.id);
        this.setState({ accountIds: ImmutableOrderedSet(accountIds) });
      })
      .catch(noOp);

  }, 900, { leading: true, trailing: true })

  handleChange = ({ target }) => {
    this.handleAccountSearch(target.value);
    this.setState({ text: target.value });
  }

  handleSelected = (tokenStart, lastToken, accountId) => {
    this.props.onSelected(accountId);
  }

  render() {
    const { intl, ...rest } = this.props;
    const { text, accountIds } = this.state;

    return (
      <AutosuggestInput
        placeholder={intl.formatMessage(messages.placeholder)}
        value={text}
        onChange={this.handleChange}
        suggestions={accountIds.toList()}
        onSuggestionsFetchRequested={noOp}
        onSuggestionsClearRequested={noOp}
        onSuggestionSelected={this.handleSelected}
        searchTokens={[]}
        {...rest}
      />
    );
  }

}
