import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { fetchAliasesSuggestions, clearAliasesSuggestions, changeAliasesSuggestions } from 'soapbox/actions/aliases';
import Icon from 'soapbox/components/icon';
import { Button } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  search: { id: 'aliases.search', defaultMessage: 'Search your old account' },
  searchTitle: { id: 'tabs_bar.search', defaultMessage: 'Search' },
});

const Search: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const value = useAppSelector(state => state.aliases.getIn(['suggestions', 'value'])) as string;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeAliasesSuggestions(e.target.value));
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      dispatch(fetchAliasesSuggestions(value));
    }
  };

  const handleSubmit = () => {
    dispatch(fetchAliasesSuggestions(value));
  };

  const handleClear = () => {
    dispatch(clearAliasesSuggestions());
  };

  const hasValue = value.length > 0;

  return (
    <div className='aliases_search search'>
      <label>
        <span style={{ display: 'none' }}>{intl.formatMessage(messages.search)}</span>

        <input
          className='search__input'
          type='text'
          value={value}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          placeholder={intl.formatMessage(messages.search)}
        />
      </label>

      <div role='button' tabIndex={0} className='search__icon' onClick={handleClear}>
        <Icon src={require('@tabler/icons/icons/backspace.svg')} aria-label={intl.formatMessage(messages.search)} className={classNames('svg-icon--backspace', { active: hasValue })} />
      </div>
      <Button onClick={handleSubmit}>{intl.formatMessage(messages.searchTitle)}</Button>
    </div>
  );
};

export default Search;
