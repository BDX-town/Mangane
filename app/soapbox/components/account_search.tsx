import classNames from 'classnames';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import AutosuggestAccountInput from 'soapbox/components/autosuggest_account_input';
import SvgIcon from 'soapbox/components/svg_icon';
import { Spinner } from 'soapbox/components/ui';

const messages = defineMessages({
  placeholder: { id: 'account_search.placeholder', defaultMessage: 'Search for an account' },
});

interface IAccountSearch {
  /** Callback when a searched account is chosen. */
  onSelected: (accountId: string) => void,
  /** Override the default placeholder of the input. */
  placeholder?: string,
  /** Position of results relative to the input. */
  resultsPosition?: 'above' | 'below',
}

/** Input to search for accounts. */
const AccountSearch: React.FC<IAccountSearch> = ({ onSelected, ...rest }) => {
  const intl = useIntl();

  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <div className='relative'>
      <label>
        <span className='sr-only'>{intl.formatMessage(messages.placeholder)}</span>
        <AutosuggestAccountInput
          className='block w-full rounded-full border border-gray-100 bg-white py-2 pl-3 pr-10 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:placeholder-gray-400 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-gray-300 sm:text-sm'
          placeholder={intl.formatMessage(messages.placeholder)}
          value={value}
          onChange={handleChange}
          onSelected={handleSelected}
          onKeyDown={handleKeyDown}
          onLoading={setIsLoading}
          {...rest}
        />
      </label>

      <div className='absolute inset-y-0 right-0 flex items-center px-3'>
        {isLoading ? (
          <Spinner size={16} withText={false} />
        ) : (
          <div role='button' tabIndex={0} className='cursor-pointer' onClick={handleClear}>
            <SvgIcon
              src={require('@tabler/icons/search.svg')}
              className={classNames('h-4 w-4 text-gray-400', { hidden: !isEmpty() })}
            />
            <SvgIcon
              src={require('@tabler/icons/backspace.svg')}
              className={classNames('h-4 w-4 text-gray-400', { hidden: isEmpty() })}
              aria-label={intl.formatMessage(messages.placeholder)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSearch;
