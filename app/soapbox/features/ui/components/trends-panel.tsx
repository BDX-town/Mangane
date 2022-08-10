import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Hashtag from 'soapbox/components/hashtag';
import { Widget } from 'soapbox/components/ui';
import useTrends from 'soapbox/queries/trends';

interface ITrendsPanel {
  limit: number
}

const TrendsPanel = ({ limit }: ITrendsPanel) => {
  const { data: trends, isFetching } = useTrends();

  const sortedTrends = React.useMemo(() => {
    return trends?.sort((a, b) => {
      const num_a = Number(a.getIn(['history', 0, 'accounts']));
      const num_b = Number(b.getIn(['history', 0, 'accounts']));
      return num_b - num_a;
    }).slice(0, limit);
  }, [trends, limit]);

  if (trends?.length === 0 || isFetching) {
    return null;
  }

  return (
    <Widget title={<FormattedMessage id='trends.title' defaultMessage='Trends' />}>
      {sortedTrends?.slice(0, limit).map((hashtag) => (
        <Hashtag key={hashtag.name} hashtag={hashtag} />
      ))}
    </Widget>
  );
};

export default TrendsPanel;
