import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from 'soapbox/components/ui';

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
          <h3><FormattedMessage id='follow_recommendations.heading' defaultMessage='Welcome to TRUTH Social' />&nbsp;<span className='follow_heading'>(Beta)</span></h3>
          <h2 className='follow_subhead'><FormattedMessage id='follow_recommendation.subhead' defaultMessage='Let&#39;s get started!' /></h2>
          <p><FormattedMessage id='follow_recommendations.lead' defaultMessage='Don&#39;t be afraid to make mistakes; you can unfollow people at any time.' /></p>
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
