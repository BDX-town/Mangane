import React from 'react';
import { useHistory } from 'react-router-dom';

import Column from 'soapbox/features/ui/components/column';

import FollowRecommendationsContainer from './components/follow_recommendations_container';

const FollowRecommendations: React.FC = () => {
  const history = useHistory();

  const onDone = () => {
    history.push('/');
  };

  return (
    <Column>
      <FollowRecommendationsContainer onDone={onDone} />
    </Column>
  );
};

export default FollowRecommendations;
