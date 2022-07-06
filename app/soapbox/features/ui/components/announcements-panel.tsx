import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import ReactSwipeableViews from 'react-swipeable-views';

import { Card, HStack, Widget } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import type { Announcement as AnnouncementEntity, Mention as MentionEntity } from 'soapbox/types/entities';

const AnnouncementContent = ({ announcement }: { announcement: AnnouncementEntity }) => {
  const history = useHistory();

  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateLinks();
  });

  const onMentionClick = (mention: MentionEntity, e: MouseEvent) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      history.push(`/@${mention.acct}`);
    }
  };

  const onHashtagClick = (hashtag: string, e: MouseEvent) => {
    hashtag = hashtag.replace(/^#/, '').toLowerCase();

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      history.push(`/tags/${hashtag}`);
    }
  };

  /** For regular links, just stop propogation */
  const onLinkClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const updateLinks = () => {
    if (!node.current) return;

    const links = node.current.querySelectorAll('a');

    links.forEach(link => {
      // Skip already processed
      if (link.classList.contains('status-link')) return;

      // Add attributes
      link.classList.add('status-link');
      link.setAttribute('rel', 'nofollow noopener');
      link.setAttribute('target', '_blank');

      const mention = announcement.mentions.find(mention => link.href === `${mention.url}`);

      // Add event listeners on mentions and hashtags
      if (mention) {
        link.addEventListener('click', onMentionClick.bind(link, mention), false);
        link.setAttribute('title', mention.acct);
      } else if (link.textContent?.charAt(0) === '#' || (link.previousSibling?.textContent?.charAt(link.previousSibling.textContent.length - 1) === '#')) {
        link.addEventListener('click', onHashtagClick.bind(link, link.text), false);
      } else {
        link.setAttribute('title', link.href);
        link.addEventListener('click', onLinkClick.bind(link), false);
      }
    });
  };


  return (
    <div
      className='translate text-sm'
      ref={node}
      dangerouslySetInnerHTML={{ __html: announcement.content }}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    />
  );
};

const Announcement = ({ announcement }: { announcement: AnnouncementEntity }) => {
  const startsAt = announcement.starts_at && new Date(announcement.starts_at);
  const endsAt = announcement.ends_at && new Date(announcement.ends_at);
  const now = new Date();
  const hasTimeRange = startsAt && endsAt;
  const skipYear = hasTimeRange && startsAt.getFullYear() === endsAt.getFullYear() && endsAt.getFullYear() === now.getFullYear();
  const skipEndDate = hasTimeRange && startsAt.getDate() === endsAt.getDate() && startsAt.getMonth() === endsAt.getMonth() && startsAt.getFullYear() === endsAt.getFullYear();
  const skipTime = announcement.all_day;

  return (
    <div>
      <strong>
        {hasTimeRange && <span> · <FormattedDate value={startsAt} hour12={false} year={(skipYear || startsAt.getFullYear() === now.getFullYear()) ? undefined : 'numeric'} month='short' day='2-digit' hour={skipTime ? undefined : '2-digit'} minute={skipTime ? undefined : '2-digit'} /> - <FormattedDate value={endsAt} hour12={false} year={(skipYear || endsAt.getFullYear() === now.getFullYear()) ? undefined : 'numeric'} month={skipEndDate ? undefined : 'short'} day={skipEndDate ? undefined : '2-digit'} hour={skipTime ? undefined : '2-digit'} minute={skipTime ? undefined : '2-digit'} /></span>}
      </strong>

      <AnnouncementContent announcement={announcement} />

      {/* <ReactionsBar
        reactions={announcement.get('reactions')}
        announcementId={announcement.get('id')}
        addReaction={this.props.addReaction}
        removeReaction={this.props.removeReaction}
        emojiMap={this.props.emojiMap}
      /> */}
    </div>
  );
};

const AnnouncementsPanel = () => {
  // const dispatch = useDispatch();
  const [index, setIndex] = useState(0);

  const announcements = useAppSelector((state) => state.announcements.items);

  if (announcements.size === 0) return null;

  const handleChangeIndex = (index: number) => {
    setIndex(index % announcements.size);
  };

  return (
    <Widget title={<FormattedMessage id='announcements.title' defaultMessage='Announcements' />}>
      <Card className='relative' size='lg' variant='rounded'>
        <ReactSwipeableViews animateHeight index={index} onChangeIndex={handleChangeIndex}>
          {announcements.map((announcement) => (
            <Announcement
              key={announcement.id}
              announcement={announcement}
            // emojiMap={emojiMap}
            // addReaction={addReaction}
            // removeReaction={removeReaction}
            // selected={index === idx}
            // disabled={disableSwiping}
            />
          )).reverse()}
        </ReactSwipeableViews>

        <HStack space={2} alignItems='center' justifyContent='center' className='relative'>
          {announcements.map((_, i) => (
            <button
              key={i}
              tabIndex={0}
              onClick={() => setIndex(i)}
              className={classNames({
                'w-2 h-2 rounded-full focus:ring-primary-600 focus:ring-2 focus:ring-offset-2': true,
                'bg-gray-200 hover:bg-gray-300': i !== index,
                'bg-primary-600': i === index,
              })}
            />
          ))}
        </HStack>
      </Card>
    </Widget>
  );
};

export default AnnouncementsPanel;
