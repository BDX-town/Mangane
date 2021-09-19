import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from 'soapbox/components/button';
import FollowRecommendationsList from './follow_recommendations_list';

export default class FollowRecommendationsContainer extends React.Component {

  static propTypes = {
    onDone: PropTypes.func.isRequired,
  }

  handleDone = () => {
    this.props.onDone();
  }

  render() {
    return (
      <div className='scrollable follow-recommendations-container'>
        <div className='column-title'>
          <h3><FormattedMessage id='follow_recommendations.heading' defaultMessage="Follow people you'd like to see posts from! Here are some suggestions." /></h3>
          <p><FormattedMessage id='follow_recommendations.lead' defaultMessage="Posts from people you follow will show up in chronological order on your home feed. Don't be afraid to make mistakes, you can unfollow people just as easily any time!" /></p>
        </div>

        <FollowRecommendationsList />

        <div className='column-actions'>
          <Button onClick={this.handleDone}>
            <FormattedMessage id='follow_recommendations.done' defaultMessage='Done' />
          </Button>
        </div>
      </div>
    );
  }

}
