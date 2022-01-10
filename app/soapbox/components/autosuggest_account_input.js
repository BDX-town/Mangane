import { CancelToken } from 'axios';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { accountSearch } from 'soapbox/actions/accounts';

import AutosuggestInput from './autosuggest_input';

const noOp = () => {};

export default @connect()
class AutosuggestAccountInput extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelected: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    limit: PropTypes.number.isRequired,
  }

  static defaultProps = {
    value: '',
    limit: 4,
  }

  state = {
    accountIds: ImmutableOrderedSet(),
  }

  source = CancelToken.source();

  refreshCancelToken = () => {
    this.source.cancel();
    this.source = CancelToken.source();
    return this.source;
  }

  clearResults = () => {
    this.setState({ accountIds: ImmutableOrderedSet() });
  }

  handleAccountSearch = throttle(q => {
    const { dispatch, limit } = this.props;
    const source = this.refreshCancelToken();

    const params = { q, limit, resolve: false };

    dispatch(accountSearch(params, source.token))
      .then(accounts => {
        const accountIds = accounts.map(account => account.id);
        this.setState({ accountIds: ImmutableOrderedSet(accountIds) });
      })
      .catch(noOp);

  }, 900, { leading: true, trailing: true })

  handleChange = e => {
    this.handleAccountSearch(e.target.value);
    this.props.onChange(e);
  }

  handleSelected = (tokenStart, lastToken, accountId) => {
    this.props.onSelected(accountId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value === '' && prevProps.value !== '') {
      this.clearResults();
    }
  }

  render() {
    const { intl, value, onChange, ...rest } = this.props;
    const { accountIds } = this.state;

    return (
      <AutosuggestInput
        value={value}
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
