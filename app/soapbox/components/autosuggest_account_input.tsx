import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import throttle from 'lodash/throttle';
import React, { useState, useRef, useCallback, useEffect } from 'react';

import { accountSearch } from 'soapbox/actions/accounts';
import AutosuggestInput, { AutoSuggestion } from 'soapbox/components/autosuggest_input';
import { useAppDispatch } from 'soapbox/hooks';

import type { Menu } from 'soapbox/components/dropdown_menu';

const noOp = () => {};

interface IAutosuggestAccountInput {
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  onSelected: (accountId: string) => void,
  value: string,
  limit?: number,
  className?: string,
  autoSelect?: boolean,
  menu?: Menu,
  onKeyDown?: React.KeyboardEventHandler,
}

const AutosuggestAccountInput: React.FC<IAutosuggestAccountInput> = ({
  onChange,
  onSelected,
  value = '',
  limit = 4,
  ...rest
}) => {
  const dispatch = useAppDispatch();
  const [accountIds, setAccountIds] = useState(ImmutableOrderedSet<string>());
  const controller = useRef(new AbortController());

  const refreshCancelToken = () => {
    controller.current.abort();
    controller.current = new AbortController();
  };

  const clearResults = () => {
    setAccountIds(ImmutableOrderedSet());
  };

  const handleAccountSearch = useCallback(throttle(q => {
    const params = { q, limit, resolve: false };

    dispatch(accountSearch(params, controller.current.signal))
      .then((accounts: { id: string }[]) => {
        const accountIds = accounts.map(account => account.id);
        setAccountIds(ImmutableOrderedSet(accountIds));
      })
      .catch(noOp);

  }, 900, { leading: true, trailing: true }), [limit]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    refreshCancelToken();
    handleAccountSearch(e.target.value);
    onChange(e);
  };

  const handleSelected = (_tokenStart: number, _lastToken: string | null, suggestion: AutoSuggestion) => {
    if (typeof suggestion === 'string' && suggestion[0] !== '#') {
      onSelected(suggestion);
    }
  };

  useEffect(() => {
    if (value === '') {
      clearResults();
    }
  }, [value]);

  return (
    <AutosuggestInput
      value={value}
      onChange={handleChange}
      suggestions={accountIds.toList()}
      onSuggestionsFetchRequested={noOp}
      onSuggestionsClearRequested={noOp}
      onSuggestionSelected={handleSelected}
      searchTokens={[]}
      {...rest}
    />
  );
};

export default AutosuggestAccountInput;
