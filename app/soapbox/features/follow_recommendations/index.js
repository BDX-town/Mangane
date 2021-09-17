import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { fetchSuggestions } from 'soapbox/actions/suggestions_v2';
import Column from 'soapbox/features/ui/components/column';
import Account from './components/account';
import Button from 'soapbox/components/button';

const mapStateToProps = state => ({
  suggestions: state.getIn(['suggestions', 'items']),
  isLoading: state.getIn(['suggestions', 'isLoading']),
});

export default @connect(mapStateToProps)
class FollowRecommendations extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

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

  handleDone = () => {
    const { router } = this.context;

    router.history.push('/');
  }

  render() {
    const { suggestions, isLoading } = this.props;

    return (
      <Column>
        <div className='scrollable follow-recommendations-container'>
          <div className='column-title'>
            <h3><FormattedMessage id='follow_recommendations.heading' defaultMessage="Follow people you'd like to see posts from! Here are some suggestions." /></h3>
            <p><FormattedMessage id='follow_recommendations.lead' defaultMessage="Posts from people you follow will show up in chronological order on your home feed. Don't be afraid to make mistakes, you can unfollow people just as easily any time!" /></p>
          </div>

          {!isLoading && (
            <>
              <div className='column-list'>
                {suggestions.size > 0 ? suggestions.map(suggestion => (
                  <Account key={suggestion.get('account')} id={suggestion.get('account')} />
                )) : (
                  <div className='column-list__empty-message'>
                    <FormattedMessage id='empty_column.follow_recommendations' defaultMessage='Looks like no suggestions could be generated for you. You can try using search to look for people you might know or explore trending hashtags.' />
                  </div>
                )}
              </div>

              <div className='column-actions'>
                <Button onClick={this.handleDone}><FormattedMessage id='follow_recommendations.done' defaultMessage='Done' /></Button>
              </div>
            </>
          )}
        </div>
      </Column>
    );
  }

}
