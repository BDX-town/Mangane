import classNames from 'classnames';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Icon from 'soapbox/components/icon';
import { useSoapboxConfig } from 'soapbox/hooks';
import { addGreentext } from 'soapbox/utils/greentext';
import { onlyEmoji as isOnlyEmoji } from 'soapbox/utils/rich_content';

import { isRtl } from '../rtl';

import Poll from './polls/poll';
import { Button, Text } from './ui';

import type { Status, Mention } from 'soapbox/types/entities';

const MAX_HEIGHT = 642; // 20px * 32 (+ 2px padding at the top)
const BIG_EMOJI_LIMIT = 10;


interface IReadMoreButton {
  onClick: React.MouseEventHandler,
}

/** Button to expand a truncated status (due to too much content) */
const ReadMoreButton: React.FC<IReadMoreButton> = ({ onClick }) => (
  <Button onClick={onClick} theme='link' size='sm' classNames='-mx-3'>
    <FormattedMessage id='status.read_more' defaultMessage='Read more' />
    <Icon className='inline-block h-5 w-5' src={require('@tabler/icons/chevron-right.svg')} fixedWidth />
  </Button>

);

interface ISpoilerButton {
  onClick: React.MouseEventHandler,
  hidden: boolean,
  tabIndex?: number,
}

/** Button to expand status text behind a content warning */
const SpoilerButton: React.FC<ISpoilerButton> = ({ onClick, hidden, tabIndex }) => (
  <Button
    theme='ghost'
    size='sm'
    onClick={onClick}
  >
    {hidden ? (
      <FormattedMessage id='status.show_more' defaultMessage='Show more' />
    ) : (
      <FormattedMessage id='status.show_less' defaultMessage='Show less' />
    )}
  </Button>
);

interface ISpoiler {
  hidden: boolean,
  status: Status,
  onClick: (event: React.MouseEvent<Element, MouseEvent>) => void,
}

const Spoiler: React.FC<ISpoiler> = ({ hidden, onClick, status }) => {
  return (
    <div className='flex items-center justify-between bg-gray-100 dark:bg-slate-700 p-2 rounded mt-1'>
      {
        status.spoiler_text.length > 0 ? (
          <span>
            <Text tag='span' weight='medium'>
              <FormattedMessage
                id='status.cw'
                defaultMessage='Warning:'
              />
            </Text>
                &nbsp;
            <span dangerouslySetInnerHTML={{ __html: status.spoilerHtml }} lang={status.language || undefined} />
          </span>
        ) : (
          <span>
            <Text tag='span'>
              <FormattedMessage
                id='status.filtered'
                defaultMessage='Filtered'
              />
            </Text>
            <br />
            <Text size='xs' theme='muted' tag='span'>
              <FormattedMessage
                id='status.filtered-hint'
                defaultMessage='Status was hidden by filter settings'
              />
            </Text>
          </span>
        )
      }
      <div className='flex gap-3 items-center'>
        {
          status.media_attachments?.count() > 0 && (
            <div aria-hidden className='flex gap-1 items-center'>
              <Icon className='inline-block' src={require('@tabler/icons/paperclip.svg')} />
              <Text tag='span' size='xs' theme='muted'>{ status.media_attachments.count() }</Text>
            </div>
          )
        }

        <SpoilerButton
          tabIndex={0}
          onClick={onClick}
          hidden={hidden}
        />
      </div>
    </div>
  );
};

interface IStatusContent {
  status: Status,
  expanded?: boolean,
  onExpandedToggle?: () => void,
  onClick?: () => void,
  collapsable?: boolean,
}

/** Renders the text content of a status */
const StatusContent: React.FC<IStatusContent> = ({ status, expanded = false, onExpandedToggle, onClick, collapsable = false }) => {
  const history = useHistory();

  const [hidden, setHidden] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [onlyEmoji, setOnlyEmoji] = useState(false);

  const node = useRef<HTMLDivElement>(null);

  const { greentext } = useSoapboxConfig();

  const onMentionClick = (mention: Mention, e: MouseEvent) => {
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
      history.push(`/tag/${hashtag}`);
    }
  };

  /** For regular links, just stop propogation */
  const onLinkClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const updateStatusLinks = () => {
    if (!node.current) return;

    const links = node.current.querySelectorAll('a');

    links.forEach(link => {
      // Skip already processed
      if (link.classList.contains('status-link')) return;

      // Add attributes
      link.classList.add('status-link');
      link.setAttribute('rel', 'nofollow noopener');
      link.setAttribute('target', '_blank');

      const mention = status.mentions.find(mention => link.href === `${mention.url}`);

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

  const maybeSetCollapsed = (): void => {
    if (!node.current) return;

    if (collapsable && onClick && !collapsed && status.spoiler_text.length === 0) {
      if (node.current.clientHeight > MAX_HEIGHT) {
        setCollapsed(true);
      }
    }
  };

  const maybeSetOnlyEmoji = (): void => {
    if (!node.current) return;
    const only = isOnlyEmoji(node.current, BIG_EMOJI_LIMIT, true);

    if (only !== onlyEmoji) {
      setOnlyEmoji(only);
    }
  };

  useEffect(() => {
    maybeSetCollapsed();
    maybeSetOnlyEmoji();
    updateStatusLinks();
  });

  const handleSpoilerClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onExpandedToggle) {
      // The parent manages the state
      onExpandedToggle();
    } else {
      setHidden(!hidden);
    }
  };

  const parsedHtml = useMemo((): string => {
    const { contentHtml: html } = status;

    if (greentext) {
      return addGreentext(html);
    } else {
      return html;
    }
  }, [status.contentHtml]);

  if (status.content.length === 0) {
    return null;
  }

  const isHidden = onExpandedToggle ? !expanded : hidden;

  const content = { __html: parsedHtml };
  const directionStyle: React.CSSProperties = { direction: 'ltr' };
  const className = classNames('status__content', {
    'status__content--with-action': onClick,
    'status__content--with-spoiler': status.spoiler_text.length > 0,
    'status__content--collapsed': collapsed,
    'status__content--big': onlyEmoji,
  });

  if (isRtl(status.search_index)) {
    directionStyle.direction = 'rtl';
  }

  return (
    <>
      <div className={`${className} flex flex-col gap-2`} ref={node} tabIndex={0} style={directionStyle}>
        {
          // post has a spoiler or was filtered
          (status.spoiler_text.length > 0 || status.filtered) && (
            <Spoiler
              status={status}
              hidden={isHidden}
              onClick={handleSpoilerClick}
            />
          )
        }
        {
          // actual content
          !isHidden && (
            <>
              <div
                tabIndex={!isHidden ? 0 : undefined}
                className={classNames('min-h-0 overflow-hidden text-ellipsis status__content__text status__content__text--visible')}
                style={directionStyle}
                dangerouslySetInnerHTML={content}
                lang={status.language || undefined}
              />
              {
              // post folded because too long
                collapsed && onClick && (
                  <div>
                    <ReadMoreButton onClick={onClick} key='read-more' />
                  </div>
                )
              }
              {
              // post has a poll
                !collapsed && status.poll && typeof status.poll === 'string' && (
                  <Poll id={status.poll} key='poll' status={status.url} />
                )
              }
            </>
          )
        }
      </div>
    </>
  );
};

export default React.memo(StatusContent);
