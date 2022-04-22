import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import Column from 'soapbox/features/ui/components/column';

import FollowRecommendationsContainer from './components/follow_recommendations_container';

export default @withRouter
class FollowRecommendations extends React.Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  onDone = () => {
    this.props.history.push('/');
  }

  render() {
    return (
      <Column>
        <FollowRecommendationsContainer onDone={this.onDone} />
      </Column>
    );
  }

}
