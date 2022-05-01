import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from 'soapbox/components/ui';

import FollowRecommendationsList from './follow_recommendations_list';

interface IFollowRecommendationsContainer {
  onDone: () => void,
}

const FollowRecommendationsContainer: React.FC<IFollowRecommendationsContainer> = ({ onDone }) => (
  <div className='scrollable follow-recommendations-container'>
    <div className='column-title'>
      <h3><FormattedMessage id='follow_recommendations.heading' defaultMessage="Follow people you'd like to see posts from! Here are some suggestions." /></h3>
      <h2 className='follow_subhead'><FormattedMessage id='follow_recommendation.subhead' defaultMessage='Let&#39;s get started!' /></h2>
      <p><FormattedMessage id='follow_recommendations.lead' defaultMessage='Don&#39;t be afraid to make mistakes; you can unfollow people at any time.' /></p>
    </div>

    <FollowRecommendationsList />

    <div className='column-actions'>
      <Button onClick={onDone}>
        <FormattedMessage id='follow_recommendations.done' defaultMessage='Done' />
      </Button>
    </div>
  </div>
);

export default FollowRecommendationsContainer;
