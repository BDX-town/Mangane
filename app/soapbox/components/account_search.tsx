import classNames from 'classnames';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import AutosuggestAccountInput from 'soapbox/components/autosuggest_account_input';
import Icon from 'soapbox/components/icon';

const messages = defineMessages({
  placeholder: { id: 'account_search.placeholder', defaultMessage: 'Search for an account' },
});

interface IAccountSearch {
  /** Callback when a searched account is chosen. */
  onSelected: (accountId: string) => void,
  /** Override the default placeholder of the input. */
  placeholder?: string,
}

/** Input to search for accounts. */
const AccountSearch: React.FC<IAccountSearch> = ({ onSelected, ...rest }) => {
  const intl = useIntl();

  const [value, setValue] = useState('');

  const isEmpty = (): boolean => {
    return !(value.length > 0);
  };

  const clearState = () => {
    setValue('');
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setValue(target.value);
  };

  const handleSelected = (accountId: string) => {
    clearState();
    onSelected(accountId);
  };

  const handleClear: React.MouseEventHandler = e => {
    e.preventDefault();

    if (!isEmpty()) {
      setValue('');
    }
  };

  const handleKeyDown: React.KeyboardEventHandler = e => {
    if (e.key === 'Escape') {
      document.querySelector('.ui')?.parentElement?.focus();
    }
  };

  return (
    <div className='search search--account'>
      <label>
        <span style={{ display: 'none' }}>{intl.formatMessage(messages.placeholder)}</span>
        <AutosuggestAccountInput
          className='rounded-full'
          placeholder={intl.formatMessage(messages.placeholder)}
          value={value}
          onChange={handleChange}
          onSelected={handleSelected}
          onKeyDown={handleKeyDown}
          {...rest}
        />
      </label>
      <div role='button' tabIndex={0} className='search__icon' onClick={handleClear}>
        <Icon src={require('@tabler/icons/icons/search.svg')} className={classNames('svg-icon--search', { active: isEmpty() })} />
        <Icon src={require('@tabler/icons/icons/backspace.svg')} className={classNames('svg-icon--backspace', { active: !isEmpty() })} aria-label={intl.formatMessage(messages.placeholder)} />
      </div>
    </div>
  );
};

export default AccountSearch;
