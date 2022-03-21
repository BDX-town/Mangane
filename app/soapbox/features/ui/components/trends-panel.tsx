import { Map as ImmutableMap } from 'immutable';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { useAppSelector } from 'soapbox/hooks';

import { fetchTrends } from '../../../actions/trends';
import Hashtag from '../../../components/hashtag';
import { Stack, Text } from '../../../components/ui';

interface ITrendsPanel {
  limit: number
}

const TrendsPanel = ({ limit }: ITrendsPanel) => {
  const dispatch = useDispatch();

  const trends: any = useAppSelector((state) => state.trends.get('items'));

  const sortedTrends = React.useMemo(() => {
    return trends.sort((a: ImmutableMap<string, any>, b: ImmutableMap<string, any>) => {
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
    <Stack space={2}>
      <Text size='xl' weight='bold'>
        <FormattedMessage id='trends.title' defaultMessage='Trends' />
      </Text>

      <Stack space={3}>
        {sortedTrends.map((hashtag: ImmutableMap<string, any>) => (
          <Hashtag key={hashtag.get('name')} hashtag={hashtag} />
        ))}
      </Stack>
    </Stack>
  );
};

export default TrendsPanel;
