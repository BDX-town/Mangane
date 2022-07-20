import React from 'react';
import { FormattedDate } from 'react-intl';

import { Stack, Text } from 'soapbox/components/ui';
import { useFeatures } from 'soapbox/hooks';

import AnnouncementContent from './announcement-content';
import ReactionsBar from './reactions-bar';

import type { Map as ImmutableMap } from 'immutable';
import type { Announcement as AnnouncementEntity } from 'soapbox/types/entities';

interface IAnnouncement {
  announcement: AnnouncementEntity;
  addReaction: (id: string, name: string) => void;
  removeReaction: (id: string, name: string) => void;
  emojiMap: ImmutableMap<string, ImmutableMap<string, string>>;
}

const Announcement: React.FC<IAnnouncement> = ({ announcement, addReaction, removeReaction, emojiMap }) => {
  const features = useFeatures();

  const startsAt = announcement.starts_at && new Date(announcement.starts_at);
  const endsAt = announcement.ends_at && new Date(announcement.ends_at);
  const now = new Date();
  const hasTimeRange = startsAt && endsAt;
  const skipYear = hasTimeRange && startsAt.getFullYear() === endsAt.getFullYear() && endsAt.getFullYear() === now.getFullYear();
  const skipEndDate = hasTimeRange && startsAt.getDate() === endsAt.getDate() && startsAt.getMonth() === endsAt.getMonth() && startsAt.getFullYear() === endsAt.getFullYear();
  const skipTime = announcement.all_day;

  return (
    <Stack className='w-full' space={2}>
      {hasTimeRange && (
        <Text theme='muted'>
          <FormattedDate
            value={startsAt}
            hour12={false}
            year={(skipYear || startsAt.getFullYear() === now.getFullYear()) ? undefined : 'numeric'}
            month='short'
            day='2-digit'
            hour={skipTime ? undefined : '2-digit'} minute={skipTime ? undefined : '2-digit'}
          />
          {' '}
          -
          {' '}
          <FormattedDate
            value={endsAt}
            hour12={false}
            year={(skipYear || endsAt.getFullYear() === now.getFullYear()) ? undefined : 'numeric'}
            month={skipEndDate ? undefined : 'short'}
            day={skipEndDate ? undefined : '2-digit'}
            hour={skipTime ? undefined : '2-digit'}
            minute={skipTime ? undefined : '2-digit'}
          />
        </Text>
      )}

      <AnnouncementContent announcement={announcement} />

      {features.announcementsReactions && (
        <ReactionsBar
          reactions={announcement.reactions}
          announcementId={announcement.id}
          addReaction={addReaction}
          removeReaction={removeReaction}
          emojiMap={emojiMap}
        />
      )}
    </Stack>
  );
};

export default Announcement;
