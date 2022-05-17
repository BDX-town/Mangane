import React from 'react';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { fetchSuggestions } from 'soapbox/actions/suggestions';
import { Spinner } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import Account from './account';

const FollowRecommendationsList: React.FC = () => {
  const dispatch = useDispatch();

  const suggestions = useAppSelector((state) => state.suggestions.get('items'));
  const isLoading = useAppSelector((state) => state.suggestions.get('isLoading'));

  useEffect(() => {
    if (suggestions.size === 0) {
      dispatch(fetchSuggestions());
    }
  }, []);

  if (isLoading) {
    return (
      <div className='column-list'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='column-list'>
      {suggestions.size > 0 ? suggestions.map((suggestion: { account: string }) => (
        <Account key={suggestion.account} id={suggestion.account} />
      )) : (
        <div className='column-list__empty-message'>
          <FormattedMessage id='empty_column.follow_recommendations' defaultMessage='Looks like no suggestions could be generated for you. You can try using search to look for people you might know or explore trending hashtags.' />
        </div>
      )}
    </div>
  );
};

export default FollowRecommendationsList;
