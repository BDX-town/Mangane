import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { fetchSuggestions } from 'soapbox/actions/suggestions';
import LoadingIndicator from 'soapbox/components/loading_indicator';

import Account from './account';

const mapStateToProps = state => ({
  suggestions: state.getIn(['suggestions', 'items']),
  isLoading: state.getIn(['suggestions', 'isLoading']),
});

export default @connect(mapStateToProps)
class FollowRecommendationsList extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    suggestions: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch, suggestions } = this.props;

    // Don't re-fetch if we're e.g. navigating backwards to this page,
    // since we don't want followed accounts to disappear from the list
    if (suggestions.size === 0) {
      dispatch(fetchSuggestions(true));
    }
  }

  render() {
    const { suggestions, isLoading } = this.props;

    if (isLoading) {
      return (
        <div className='column-list'>
          <LoadingIndicator />
        </div>
      );
    }

    return (
      <div className='column-list'>
        {suggestions.size > 0 ? suggestions.map(suggestion => (
          <Account key={suggestion.get('account')} id={suggestion.get('account')} />
        )) : (
          <div className='column-list__empty-message'>
            <FormattedMessage id='empty_column.follow_recommendations' defaultMessage='Looks like no suggestions could be generated for you. You can try using search to look for people you might know or explore trending hashtags.' />
          </div>
        )}
      </div>
    );

  }

}
