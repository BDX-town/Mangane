import classnames from 'classnames';
import { List as ImmutableList } from 'immutable';
import React, { useState } from 'react';

import Blurhash from 'soapbox/components/blurhash';
import Icon from 'soapbox/components/icon';
import { HStack, Stack, Text } from 'soapbox/components/ui';
import { normalizeAttachment } from 'soapbox/normalizers';
import { sanitizeUrl } from 'soapbox/utils/url-policy';

import type { Card as CardEntity, Attachment } from 'soapbox/types/entities';

const trim = (text: string, len: number): string => {
  const cut = text.indexOf(' ', len);

  if (cut === -1) {
    return text;
  }

  return text.substring(0, cut) + (text.length > len ? '…' : '');
};

interface ICard {
  card: CardEntity,
  maxTitle?: number,
  maxDescription?: number,
  onOpenMedia: (attachments: ImmutableList<Attachment>, index: number) => void,
  compact?: boolean,
  defaultWidth?: number,
  cacheWidth?: (width: number) => void,
  horizontal?: boolean,
}

const Card: React.FC<ICard> = ({
  card,
  defaultWidth = 467,
  maxTitle = 120,
  maxDescription = 200,
  compact = false,
  cacheWidth,
  onOpenMedia,
  horizontal,
}): JSX.Element => {
  const [width, setWidth] = useState(defaultWidth);
  const trimmedTitle       = trim(card.title, maxTitle);
  const trimmedDescription = trim(card.description, maxDescription);
  const safeCardUrl = sanitizeUrl(card.url);
  const safeCardImage = sanitizeUrl(card.image, 'media');
  const safeEmbedUrl = sanitizeUrl(card.embed_url, 'media');

  const handlePhotoClick = () => {
    if (!safeEmbedUrl) return;

    const attachment = normalizeAttachment({
      type: 'image',
      url: safeEmbedUrl,
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
    } else if (safeCardUrl) {
      window.open(safeCardUrl, '_blank', 'noopener,noreferrer');
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

  const getRatio = (card: CardEntity): number => {
    const ratio  = (card.width / card.height) || 16 / 9;

    // Constrain to a sane limit
    // https://en.wikipedia.org/wiki/Aspect_ratio_(image)
    return Math.min(Math.max(9 / 16, ratio), 4);
  };

  const interactive = card.type !== 'link';
  horizontal = typeof horizontal === 'boolean' ? horizontal : interactive;
  const className   = classnames('status-card', { horizontal, compact, interactive }, `status-card--${card.type}`);
  const ratio       = getRatio(card);
  const height      = compact ? (width / (16 / 9)) : (width / ratio);

  const title = interactive ? (
    <a
      onClick={(e) => e.stopPropagation()}
      href={safeCardUrl || undefined}
      title={trimmedTitle}
      rel='nofollow noopener noreferrer'
      target='_blank'
    >
      <span>{trimmedTitle}</span>
    </a>
  ) : (
    <span title={trimmedTitle}>{trimmedTitle}</span>
  );

  const description = (
    <Stack space={2} className='flex-1 overflow-hidden p-4'>
      {trimmedTitle && (
        <Text weight='bold'>{title}</Text>
      )}
      {trimmedDescription && (
        <Text>{trimmedDescription}</Text>
      )}
      <HStack space={1} alignItems='center'>
        <Text tag='span' theme='muted'>
          <Icon src={require('@tabler/icons/link.svg')} />
        </Text>
        <Text tag='span' theme='muted' size='sm'>
          {card.provider_name}
        </Text>
      </HStack>
    </Stack>
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
        backgroundImage: safeCardImage ? `url(${JSON.stringify(safeCardImage)})` : undefined,
        width: horizontal ? width : undefined,
        height: horizontal ? height : undefined,
      }}
      className='status-card__image-image'
    />
  );

  if (interactive) {
    let iconVariant = require('@tabler/icons/player-play.svg');

    if (card.type === 'photo') {
      iconVariant = require('@tabler/icons/zoom-in.svg');
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
                  href={safeCardUrl || undefined}
                  target='_blank'
                  rel='nofollow noopener noreferrer'
                  className='text-gray-400 hover:text-gray-600'
                >
                  <Icon
                    src={require('@tabler/icons/external-link.svg')}
                    className='w-5 h-5 text-inherit'
                  />
                </a>
              )}
            </HStack>
          </div>
        </div>
      </div>
    );

    return (
      <div className={className} ref={setRef}>
        {embed}
        {description}
      </div>
    );
  } else if (card.image) {
    embed = (
      <div className={classnames(
        'status-card__image',
        'w-full rounded-l md:w-auto md:h-auto flex-none md:flex-auto',
        {
          'h-auto': horizontal,
          'h-[200px]': !horizontal,
        },
      )}
      >
        {canvas}
        {thumbnail}
      </div>
    );
  } else {
    embed = (
      <div className='status-card__image status-card__image--empty'>
        <Icon src={require('@tabler/icons/file-text.svg')} />
      </div>
    );
  }

  return (
    <a
      href={safeCardUrl || undefined}
      className={className}
      target='_blank'
      rel='nofollow noopener noreferrer'
      ref={setRef}
      onClick={e => e.stopPropagation()}
    >
      {embed}
      {description}
    </a>
  );
};

export default Card;
