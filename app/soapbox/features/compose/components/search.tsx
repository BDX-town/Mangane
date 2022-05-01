import classNames from 'classnames';
import { Map as ImmutableMap } from 'immutable';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import AutosuggestAccountInput from 'soapbox/components/autosuggest_account_input';
import SvgIcon from 'soapbox/components/ui/icon/svg-icon';
import { useAppSelector } from 'soapbox/hooks';

import {
  changeSearch,
  clearSearch,
  submitSearch,
  showSearch,
} from '../../../actions/search';

const messages = defineMessages({
  placeholder: { id: 'search.placeholder', defaultMessage: 'Search' },
  action: { id: 'search.action', defaultMessage: 'Search for “{query}”' },
});

function redirectToAccount(accountId: number, routerHistory: any) {
  return (_dispatch: any, getState: () => ImmutableMap<string, any>) => {
    const acct = getState().getIn(['accounts', accountId, 'acct']);

    if (acct && routerHistory) {
      routerHistory.push(`/@${acct}`);
    }
  };
}

interface ISearch {
  autoFocus?: boolean,
  autoSubmit?: boolean,
  autosuggest?: boolean,
  openInRoute?: boolean
}

const Search = (props: ISearch) => {
  const {
    autoFocus = false,
    autoSubmit = false,
    autosuggest = false,
    openInRoute = false,
  } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();

  const value = useAppSelector((state) => state.search.get('value'));
  const submitted = useAppSelector((state) => state.search.get('submitted'));

  const debouncedSubmit = debounce(() => {
    dispatch(submitSearch());
  }, 900);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    dispatch(changeSearch(value));

    if (autoSubmit) {
      debouncedSubmit();
    }
  };

  const handleClear = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (value.length > 0 || submitted) {
      dispatch(clearSearch());
    }
  };

  const handleSubmit = () => {
    dispatch(submitSearch());

    if (openInRoute) {
      history.push('/search');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      handleSubmit();
    } else if (event.key === 'Escape') {
      document.querySelector('.ui')?.parentElement?.focus();
    }
  };

  const handleFocus = () => {
    dispatch(showSearch());
  };

  const handleSelected = (accountId: number) => {
    dispatch(clearSearch());
    dispatch(redirectToAccount(accountId, history));
  };

  const makeMenu = () => [
    {
      text: intl.formatMessage(messages.action, { query: value }),
      icon: require('@tabler/icons/icons/search.svg'),
      action: handleSubmit,
    },
  ];

  const hasValue = value.length > 0 || submitted;
  const Component = autosuggest ? AutosuggestAccountInput : 'input';

  return (
    <div className='w-full'>
      <label htmlFor='search' className='sr-only'>{intl.formatMessage(messages.placeholder)}</label>

      <div className='relative'>
        <Component
          className='block w-full pl-3 pr-10 py-2 border border-gray-100 dark:border-slate-600 rounded-full leading-5 bg-gray-100 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 dark:bg-slate-900 focus:bg-white focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          type='text'
          id='search'
          placeholder={intl.formatMessage(messages.placeholder)}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onSelected={handleSelected}
          autoFocus={autoFocus}
          autoSelect={false}
          menu={makeMenu()}
        />

        <div
          role='button'
          tabIndex={0}
          className='absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer'
          onClick={handleClear}
        >
          <SvgIcon
            src={require('@tabler/icons/icons/search.svg')}
            className={classNames('h-4 w-4 text-gray-400', { hidden: hasValue })}
          />

          <SvgIcon
            src={require('@tabler/icons/icons/x.svg')}
            className={classNames('h-4 w-4 text-gray-400', { hidden: !hasValue })}
            aria-label={intl.formatMessage(messages.placeholder)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
