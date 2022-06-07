import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { fetchTrends } from 'soapbox/actions/trends';
import Hashtag from 'soapbox/components/hashtag';
import { Widget } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

interface ITrendsPanel {
  limit: number
}

const TrendsPanel = ({ limit }: ITrendsPanel) => {
  const dispatch = useDispatch();

  const trends = useAppSelector((state) => state.trends.get('items'));

  const sortedTrends = React.useMemo(() => {
    return trends.sort((a, b) => {
      const num_a = Number(a.getIn(['history', 0, 'accounts']));
      const num_b = Number(b.getIn(['history', 0, 'accounts']));
      return num_b - num_a;
    }).slice(0, limit);
  }, [trends, limit]);

  React.useEffect(() => {
    dispatch(fetchTrends());
  }, []);

  if (sortedTrends.isEmpty()) {
    return null;
  }

  return (
    <Widget title={<FormattedMessage id='trends.title' defaultMessage='Trends' />}>
      {sortedTrends.map((hashtag) => (
        <Hashtag key={hashtag.name} hashtag={hashtag} />
      ))}
    </Widget>
  );
};

export default TrendsPanel;
