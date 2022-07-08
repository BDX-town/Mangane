import classNames from 'classnames';
import { Map as ImmutableMap } from 'immutable';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { TransitionMotion, spring } from 'react-motion';
import { useHistory } from 'react-router-dom';
import ReactSwipeableViews from 'react-swipeable-views';
import { createSelector } from 'reselect';

import { Card, HStack, Widget } from 'soapbox/components/ui';
import EmojiPickerDropdown from 'soapbox/features/compose/containers/emoji_picker_dropdown_container';
import unicodeMapping from 'soapbox/features/emoji/emoji_unicode_mapping_light';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';
import { joinPublicPath } from 'soapbox/utils/static';

import type { RootState } from 'soapbox/store';
import type { Announcement as AnnouncementEntity, Mention as MentionEntity } from 'soapbox/types/entities';

const customEmojiMap = createSelector([(state: RootState) => state.custom_emojis], items => items.reduce((map, emoji) => map.set(emoji.shortcode, emoji), ImmutableMap()));

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

const Emoji = ({ emoji, emojiMap, hovered }) => {
  const autoPlayGif = useSettings().get('autoPlayGif');

  if (unicodeMapping[emoji]) {
    const { filename, shortCode } = unicodeMapping[emoji];
    const title = shortCode ? `:${shortCode}:` : '';

    return (
      <img
        draggable='false'
        className='emojione'
        alt={emoji}
        title={title}
        src={joinPublicPath(`/emoji/${filename}.svg`)}
      />
    );
  } else if (emojiMap.get(emoji)) {
    const filename  = (autoPlayGif || hovered) ? emojiMap.getIn([emoji, 'url']) : emojiMap.getIn([emoji, 'static_url']);
    const shortCode = `:${emoji}:`;

    return (
      <img
        draggable='false'
        className='emojione custom-emoji'
        alt={shortCode}
        title={shortCode}
        src={filename}
      />
    );
  } else {
    return null;
  }
};


const Reaction = ({ announcementId, reaction, addReaction, removeReaction, emojiMap, style }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (reaction.get('me')) {
      removeReaction(announcementId, reaction.get('name'));
    } else {
      addReaction(announcementId, reaction.get('name'));
    }
  };

  const handleMouseEnter = () => setHovered(true);

  const handleMouseLeave = () => setHovered(false);

  let shortCode = reaction.get('name');

  if (unicodeMapping[shortCode]) {
    shortCode = unicodeMapping[shortCode].shortCode;
  }

  return (
    <button className={classNames('reactions-bar__item', { active: reaction.get('me') })} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} title={`:${shortCode}:`} style={style}>
      <span className='reactions-bar__item__emoji'><Emoji hovered={hovered} emoji={reaction.get('name')} emojiMap={emojiMap} /></span>
      <span className='reactions-bar__item__count'>
        {reaction.get('count')}
        {/* <AnimatedNumber value={reaction.get('count')} /> */}
      </span>
    </button>
  );


};

const ReactionsBar = ({ announcementId, reactions, addReaction, removeReaction, emojiMap }) => {
  const reduceMotion = useSettings().get('reduceMotion');

  const handleEmojiPick = data => {
    addReaction(announcementId, data.native.replace(/:/g, ''));
  };

  const willEnter = () => reduceMotion ? 1 : 0;

  const willLeave = () => reduceMotion ? 0 : spring(0, { stiffness: 170, damping: 26 });

  const visibleReactions = reactions.filter(x => x.get('count') > 0);

  const styles = visibleReactions.map(reaction => ({
    key: reaction.get('name'),
    data: reaction,
    style: { scale: reduceMotion ? 1 : spring(1, { stiffness: 150, damping: 13 }) },
  })).toArray();

  return (
    <TransitionMotion styles={styles} willEnter={willEnter} willLeave={willLeave}>
      {items => (
        <div className={classNames('reactions-bar', { 'reactions-bar--empty': visibleReactions.isEmpty() })}>
          {items.map(({ key, data, style }) => (
            <Reaction
              key={key}
              reaction={data}
              style={{ transform: `scale(${style.scale})`, position: style.scale < 0.5 ? 'absolute' : 'static' }}
              announcementId={announcementId}
              addReaction={addReaction}
              removeReaction={removeReaction}
              emojiMap={emojiMap}
            />
          ))}

          {visibleReactions.size < 8 && <EmojiPickerDropdown onPickEmoji={handleEmojiPick} />}
        </div>
      )}
    </TransitionMotion>
  );
};

const Announcement = ({ announcement, addReaction, removeReaction, emojiMap }: { announcement: AnnouncementEntity }) => {
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
        addReaction={addReaction}
        removeReaction={removeReaction}
        emojiMap={emojiMap}
      /> */}
    </div>
  );
};

const AnnouncementsPanel = () => {
  const dispatch = useAppDispatch();
  // const emojiMap = useAppSelector(state => customEmojiMap(state));
  const [index, setIndex] = useState(0);

  const announcements = useAppSelector((state) => state.announcements.items);

  const addReaction = (id: string, name: string) => dispatch(addReaction(id, name));
  const removeReaction = (id: string, name: string) => dispatch(removeReaction(id, name));

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
              addReaction={addReaction}
              removeReaction={removeReaction}
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
