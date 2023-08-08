import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Sparklines, SparklinesCurve } from 'react-sparklines';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { useAppSelector } from 'soapbox/hooks';

import { shortNumberFormat } from '../utils/numbers';

import Permalink from './permalink';
import { HStack, Stack, Text } from './ui';

import type { Tag } from 'soapbox/types/entities';

interface IHashtag {
  hashtag: Tag,
}

const Hashtag: React.FC<IHashtag> = ({ hashtag }) => {
  const count = Number(hashtag.history?.get(0)?.accounts);
  const brandColor = useAppSelector((state) => getSoapboxConfig(state).brandColor);

  return (
    <HStack alignItems='center' justifyContent='between' data-testid='hashtag'>
      <Stack>
        <Permalink href={hashtag.url} to={`/tag/${hashtag.name}`} className='hover:underline'>
          <Text tag='span' size='sm' weight='semibold'>#{hashtag.name}</Text>
        </Permalink>

        {hashtag.history && (
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

      {hashtag.history && (
        <div className='w-[40px]' data-testid='sparklines'>
          <Sparklines
            width={40}
            height={28}
            data={hashtag.history.reverse().map((day) => +day.uses).toArray()}
          >
            <SparklinesCurve style={{ fill: 'none' }} color={brandColor} />
          </Sparklines>
        </div>
      )}
    </HStack>
  );
};

export default Hashtag;
