import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Sparklines, SparklinesCurve } from 'react-sparklines';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';

import { shortNumberFormat } from '../utils/numbers';

import Permalink from './permalink';
import { HStack, Stack, Text } from './ui';

import type { Hashtag as HashtagEntity } from 'soapbox/reducers/search';
import type { TrendingHashtag } from 'soapbox/reducers/trends';

interface IHashtag {
  hashtag: HashtagEntity | TrendingHashtag,
}

const Hashtag: React.FC<IHashtag> = ({ hashtag }) => {
  const history = (hashtag as TrendingHashtag).history;
  const count = Number(history?.get(0)?.accounts);
  const brandColor = useSelector((state) => getSoapboxConfig(state).brandColor);

  return (
    <HStack alignItems='center' justifyContent='between' data-testid='hashtag'>
      <Stack>
        <Permalink href={hashtag.url} to={`/tags/${hashtag.name}`} className='hover:underline'>
          <Text tag='span' size='sm' weight='semibold'>#{hashtag.name}</Text>
        </Permalink>

        {history && (
          <Text theme='muted' size='sm'>
            <FormattedMessage
              id='trends.count_by_accounts'
              defaultMessage='{count} {rawCount, plural, one {person} other {people}} talking'
              values={{
                rawCount: count,
                count: <strong>{shortNumberFormat(count)}</strong>,
              }}
            />
          </Text>
        )}
      </Stack>

      {history && (
        <div className='w-[40px]' data-testid='sparklines'>
          <Sparklines
            width={40}
            height={28}
            data={history.reverse().map((day) => +day.uses).toArray()}
          >
            <SparklinesCurve style={{ fill: 'none' }} color={brandColor} />
          </Sparklines>
        </div>
      )}
    </HStack>
  );
};

export default Hashtag;
