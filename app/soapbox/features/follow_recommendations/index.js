import PropTypes from 'prop-types';
import React from 'react';

import Column from 'soapbox/features/ui/components/column';

import FollowRecommendationsContainer from './components/follow_recommendations_container';

export default class FollowRecommendations extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  onDone = () => {
    const { router } = this.context;

    router.history.push('/');
  }

  render() {
    return (
      <Column>
        <FollowRecommendationsContainer onDone={this.onDone} />
      </Column>
    );
  }

}
