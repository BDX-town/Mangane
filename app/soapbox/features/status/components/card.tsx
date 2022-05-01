import classnames from 'classnames';
import { List as ImmutableList } from 'immutable';
import React, { useState, useEffect } from 'react';

import Blurhash from 'soapbox/components/blurhash';
import Icon from 'soapbox/components/icon';
import { HStack } from 'soapbox/components/ui';
import { normalizeAttachment } from 'soapbox/normalizers';

import type { Card as CardEntity, Attachment } from 'soapbox/types/entities';

const trim = (text: string, len: number): string => {
  const cut = text.indexOf(' ', len);

  if (cut === -1) {
    return text;
  }

  return text.substring(0, cut) + (text.length > len ? '…' : '');
};

const domParser = new DOMParser();

const addAutoPlay = (html: string): string => {
  const document = domParser.parseFromString(html, 'text/html').documentElement;
  const iframe = document.querySelector('iframe');

  if (iframe) {
    if (iframe.src.indexOf('?') !== -1) {
      iframe.src += '&';
    } else {
      iframe.src += '?';
    }

    iframe.src += 'autoplay=1&auto_play=1';
    iframe.allow = 'autoplay';

    // DOM parser creates html/body elements around original HTML fragment,
    // so we need to get innerHTML out of the body and not the entire document
    return (document.querySelector('body') as HTMLBodyElement).innerHTML;
  }

  return html;
};

interface ICard {
  card: CardEntity,
  maxTitle?: number,
  maxDescription?: number,
  onOpenMedia: (attachments: ImmutableList<Attachment>, index: number) => void,
  compact?: boolean,
  defaultWidth?: number,
  cacheWidth?: (width: number) => void,
}

const Card: React.FC<ICard> = ({
  card,
  defaultWidth = 467,
  maxTitle = 120,
  maxDescription = 200,
  compact = false,
  cacheWidth,
  onOpenMedia,
}): JSX.Element => {
  const [width, setWidth] = useState(defaultWidth);
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    setEmbedded(false);
  }, [card.url]);

  const trimmedTitle       = trim(card.title, maxTitle);
  const trimmedDescription = trim(card.description, maxDescription);

  const handlePhotoClick = () => {
    const attachment = normalizeAttachment({
      type: 'image',
      url: card.embed_url,
      description: trimmedTitle,
      meta: {
        original: {
          width: card.width,
          height: card.height,
        },
      },
    });

    onOpenMedia(ImmutableList([attachment]), 0);
  };

  const handleEmbedClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();

    if (card.type === 'photo') {
      handlePhotoClick();
    } else {
      setEmbedded(true);
    }
  };

  const setRef: React.RefCallback<HTMLElement> = c => {
    if (c) {
      if (cacheWidth) {
        cacheWidth(c.offsetWidth);
      }

      setWidth(c.offsetWidth);
    }
  };

  const renderVideo = () => {
    const content   = { __html: addAutoPlay(card.html) };
    const ratio     = getRatio(card);
    const height    = width / ratio;

    return (
      <div
        ref={setRef}
        className='status-card__image status-card-video'
        dangerouslySetInnerHTML={content}
        style={{ height }}
      />
    );
  };

  const getRatio = (card: CardEntity): number => {
    const ratio  = (card.width / card.height) || 16 / 9;

    // Constrain to a sane limit
    // https://en.wikipedia.org/wiki/Aspect_ratio_(image)
    return Math.min(Math.max(9 / 16, ratio), 4);
  };

  const interactive = card.type !== 'link';
  const horizontal  = interactive || embedded;
  const className   = classnames('status-card', { horizontal, compact, interactive }, `status-card--${card.type}`);
  const ratio       = getRatio(card);
  const height      = (compact && !embedded) ? (width / (16 / 9)) : (width / ratio);

  const title = interactive ? (
    <a
      onClick={(e) => e.stopPropagation()}
      className='status-card__title'
      href={card.url}
      title={trimmedTitle}
      rel='noopener'
      target='_blank'
    >
      <strong>{trimmedTitle}</strong>
    </a>
  ) : (
    <strong className='status-card__title' title={trimmedTitle}>{trimmedTitle}</strong>
  );

  const description = (
    <div className='status-card__content cursor-default'>
      <span className='status-card__title'>{title}</span>
      <p className='status-card__description'>{trimmedDescription}</p>
      <span className='status-card__host'><Icon src={require('@tabler/icons/icons/link.svg')} /> {card.provider_name}</span>
    </div>
  );

  let embed: React.ReactNode = '';

  const canvas = (
    <Blurhash
      className='absolute w-full h-full inset-0 -z-10'
      hash={card.blurhash}
    />
  );

  const thumbnail = (
    <div
      style={{
        backgroundImage: `url(${card.image})`,
        width: horizontal ? width : undefined,
        height: horizontal ? height : undefined,
      }}
      className='status-card__image-image'
    />
  );

  if (interactive) {
    if (embedded) {
      embed = renderVideo();
    } else {
      let iconVariant = require('@tabler/icons/icons/player-play.svg');

      if (card.type === 'photo') {
        iconVariant = require('@tabler/icons/icons/zoom-in.svg');
      }

      embed = (
        <div className='status-card__image'>
          {canvas}
          {thumbnail}

          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='bg-white shadow-md rounded-md p-2 flex items-center justify-center'>
              <HStack space={3} alignItems='center'>
                <button onClick={handleEmbedClick} className='appearance-none text-gray-400 hover:text-gray-600'>
                  <Icon
                    src={iconVariant}
                    className='w-5 h-5 text-inherit'
                  />
                </button>

                {horizontal && (
                  <a
                    onClick={(e) => e.stopPropagation()}
                    href={card.url}
                    target='_blank'
                    rel='noopener'
                    className='text-gray-400 hover:text-gray-600'
                  >
                    <Icon
                      src={require('@tabler/icons/icons/external-link.svg')}
                      className='w-5 h-5 text-inherit'
                    />
                  </a>
                )}
              </HStack>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={className} ref={setRef}>
        {embed}
        {description}
      </div>
    );
  } else if (card.image) {
    embed = (
      <div className='status-card__image'>
        {canvas}
        {thumbnail}
      </div>
    );
  } else {
    embed = (
      <div className='status-card__image status-card__image--empty'>
        <Icon src={require('@tabler/icons/icons/file-text.svg')} />
      </div>
    );
  }

  return (
    <a
      href={card.url}
      className={className}
      target='_blank'
      rel='noopener'
      ref={setRef}
      onClick={e => e.stopPropagation()}
    >
      {embed}
      {description}
    </a>
  );
};

export default Card;
