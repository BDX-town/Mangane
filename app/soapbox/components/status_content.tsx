import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Icon from 'soapbox/components/icon';
import Poll from 'soapbox/components/poll';
import { useSoapboxConfig } from 'soapbox/hooks';
import { addGreentext } from 'soapbox/utils/greentext';
import { onlyEmoji as isOnlyEmoji } from 'soapbox/utils/rich_content';

import { isRtl } from '../rtl';

import type { Status, Mention } from 'soapbox/types/entities';

const MAX_HEIGHT = 642; // 20px * 32 (+ 2px padding at the top)
const BIG_EMOJI_LIMIT = 10;

type Point = [
  x: number,
  y: number,
]

interface IReadMoreButton {
  onClick: React.MouseEventHandler,
}

/** Button to expand a truncated status (due to too much content) */
const ReadMoreButton: React.FC<IReadMoreButton> = ({ onClick }) => (
  <button className='status__content__read-more-button' onClick={onClick}>
    <FormattedMessage id='status.read_more' defaultMessage='Read more' />
    <Icon id='angle-right' fixedWidth />
  </button>
);

interface ISpoilerButton {
  onClick: React.MouseEventHandler,
  hidden: boolean,
  tabIndex?: number,
}

/** Button to expand status text behind a content warning */
const SpoilerButton: React.FC<ISpoilerButton> = ({ onClick, hidden, tabIndex }) => (
  <button
    tabIndex={tabIndex}
    className={classNames(
      'inline-block rounded-md px-1.5 py-0.5 ml-[0.5em]',
      'text-black dark:text-white',
      'font-bold text-[11px] uppercase',
      'bg-primary-100 dark:bg-primary-900',
      'hover:bg-primary-300 dark:hover:bg-primary-600',
      'focus:bg-primary-200 dark:focus:bg-primary-600',
      'hover:no-underline',
      'duration-100',
    )}
    onClick={onClick}
  >
    {hidden ? (
      <FormattedMessage id='status.show_more' defaultMessage='Show more' />
    ) : (
      <FormattedMessage id='status.show_less' defaultMessage='Show less' />
    )}
  </button>
);

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

  const startXY = useRef<Point>();
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
      history.push(`/tags/${hashtag}`);
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

  const refresh = (): void => {
    maybeSetCollapsed();
    maybeSetOnlyEmoji();
    updateStatusLinks();
  };

  useEffect(() => {
    refresh();
  });

  const handleMouseDown: React.EventHandler<React.MouseEvent> = (e) => {
    startXY.current = [e.clientX, e.clientY];
  };

  const handleMouseUp: React.EventHandler<React.MouseEvent> = (e) => {
    if (!startXY.current) return;
    const target = e.target as HTMLElement;
    const parentNode = target.parentNode as HTMLElement;

    const [ startX, startY ] = startXY.current;
    const [ deltaX, deltaY ] = [Math.abs(e.clientX - startX), Math.abs(e.clientY - startY)];

    if (target.localName === 'button' || target.localName === 'a' || (parentNode && (parentNode.localName === 'button' || parentNode.localName === 'a'))) {
      return;
    }

    if (deltaX + deltaY < 5 && e.button === 0 && onClick) {
      onClick();
    }

    startXY.current = undefined;
  };

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

  const getHtmlContent = (): string => {
    const { contentHtml: html } = status;
    if (greentext) return addGreentext(html);
    return html;
  };

  if (status.content.length === 0) {
    return null;
  }

  const isHidden = onExpandedToggle ? !expanded : hidden;

  const content = { __html: getHtmlContent() };
  const spoilerContent = { __html: status.spoilerHtml };
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

  if (status.spoiler_text.length > 0) {
    return (
      <div className={className} ref={node} tabIndex={0} style={directionStyle} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <p style={{ marginBottom: isHidden && status.mentions.isEmpty() ? 0 : undefined }}>
          <span dangerouslySetInnerHTML={spoilerContent} lang={status.language || undefined} />

          <SpoilerButton
            tabIndex={0}
            onClick={handleSpoilerClick}
            hidden={isHidden}
          />
        </p>

        <div
          tabIndex={!isHidden ? 0 : undefined}
          className={classNames('status__content__text', {
            'status__content__text--visible': !isHidden,
          })}
          style={directionStyle}
          dangerouslySetInnerHTML={content}
          lang={status.language || undefined}
        />

        {!isHidden && status.poll && typeof status.poll === 'string' && (
          <Poll id={status.poll} status={status.url} />
        )}
      </div>
    );
  } else if (onClick) {
    const output = [
      <div
        ref={node}
        tabIndex={0}
        key='content'
        className={className}
        style={directionStyle}
        dangerouslySetInnerHTML={content}
        lang={status.language || undefined}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />,
    ];

    if (collapsed) {
      output.push(<ReadMoreButton onClick={onClick} key='read-more' />);
    }

    if (status.poll && typeof status.poll === 'string') {
      output.push(<Poll id={status.poll} key='poll' status={status.url} />);
    }

    return <>{output}</>;
  } else {
    const output = [
      <div
        ref={node}
        tabIndex={0}
        key='content'
        className={classNames('status__content', {
          'status__content--big': onlyEmoji,
        })}
        style={directionStyle}
        dangerouslySetInnerHTML={content}
        lang={status.language || undefined}
      />,
    ];

    if (status.poll && typeof status.poll === 'string') {
      output.push(<Poll id={status.poll} key='poll' status={status.url} />);
    }

    return <>{output}</>;
  }
};

export default StatusContent;
