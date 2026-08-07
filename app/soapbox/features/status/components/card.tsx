import classnames from 'classnames';
import { List as ImmutableList } from 'immutable';
import React, { ReactNode, useState } from 'react';

import Blurhash from 'soapbox/components/blurhash';
import Icon from 'soapbox/components/icon';
import { HStack, Stack, Text } from 'soapbox/components/ui';
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
    if (iframe.src.includes('?')) {
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
  onOpenMedia: (attachments: ImmutableList<Attachment>, index: number) => void,
}

const CardLink = ({
  className,
  card,
  description,
}: { className: string, card: ICard['card'], description: ReactNode }) => {
  return (
    <a
      href={card.url}
      className={className}
      target='_blank'
      rel='noopener'
      onClick={e => e.stopPropagation()}
    >
      {
        card.image ? (
          <div className={classnames(
            'status-card__image',
            'w-full rounded-l md:w-auto md:h-auto flex-none md:flex-auto',
            'h-[200px]',
          )}
          >
            <Blurhash
              className='absolute w-full h-full inset-0 -z-10'
              hash={card.blurhash}
            />
            <div
              style={{
                backgroundImage: `url(${card.image})`,
              }}
              className='status-card__image-image'
            />
          </div>
        ) : (
          <div className='status-card__image status-card__image--empty'>
            <Icon src={require('@tabler/icons/file-text.svg')} />
          </div>
        )
      }

      {description}
    </a>
  );
};

const CardPhoto = ({
  className,
  card,
  description,
  onOpenMedia,
  trimmedTitle,
}: { className: string, trimmedTitle: string, card: ICard['card'], description: ReactNode, onOpenMedia: ICard['onOpenMedia'] }) => {

  const handlePhotoClick = (e) => {
    e.stopPropagation();
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

  return (
    <a
      href={card.url}
      className={className}
      target='_blank'
      rel='noopener'
      onClick={handlePhotoClick}
    >
      <div className={classnames(
        'status-card__image',
        'w-full rounded-l md:w-auto md:h-auto flex-none md:flex-auto',
        'h-[200px]',
      )}
      >
        <Blurhash
          className='absolute w-full h-full inset-0 -z-10'
          hash={card.blurhash}
        />
        <div
          style={{
            backgroundImage: `url(${card.image})`,
          }}
          className='status-card__image-image'
        />
      </div>
      {description}
    </a>
  );
};


const CardVideo = ({
  className,
  card,
  description,
}: { className: string, card: ICard['card'], description: ReactNode }) => {
  const [embedded, setEmbedded] = useState(false);
  const [width, setWidth] = useState(0);

  const getRatio = (card: CardEntity): number => {
    const ratio = (card.width / card.height) || 16 / 9;

    // Constrain to a sane limit
    // https://en.wikipedia.org/wiki/Aspect_ratio_(image)
    return Math.min(Math.max(9 / 16, ratio), 4);
  };

  const ratio = getRatio(card);
  const height = width / ratio;

  const handleEmbedClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    setEmbedded(true);
  };

  const setRef: React.RefCallback<HTMLElement> = c => {
    if (c) {
      setWidth(c.offsetWidth);
    }
  };

  return (
    <a
      href={card.url}
      className={className}
      target='_blank'
      rel='noopener'
      onClick={e => e.stopPropagation()}
    >
      {
        embedded ? (
          <div
            ref={setRef}
            className='status-card__image status-card-video'
            dangerouslySetInnerHTML={{ __html: addAutoPlay(card.html) }}
            style={{ height }}
          />
        ) : (
          <div className='status-card__image'>
            <Blurhash
              className='absolute w-full h-full inset-0 -z-10'
              hash={card.blurhash}
            />
            <div
              style={{
                backgroundImage: `url(${card.image})`,
              }}
              className='status-card__image-image'
            />

            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='bg-white shadow-md rounded-md p-2 flex items-center justify-center'>
                <HStack space={3} alignItems='center'>
                  <button onClick={handleEmbedClick} className='appearance-none text-gray-400 hover:text-gray-600'>
                    <Icon
                      src={require('@tabler/icons/player-play.svg')}
                      className='w-5 h-5 text-inherit'
                    />
                  </button>
                </HStack>
              </div>
            </div>
          </div>
        )

      }

      {description}
    </a>
  );
};



const Card: React.FC<ICard> = ({
  card,
  onOpenMedia,
}): JSX.Element => {

  const trimmedTitle = trim(card.title, 120);
  const trimmedDescription = trim(card.description, 200);

  const interactive = card.type !== 'link';
  const className = classnames('status-card', { interactive }, `status-card--${card.type}`);

  const title = interactive ? (
    <a
      onClick={(e) => e.stopPropagation()}
      href={card.url}
      title={trimmedTitle}
      rel='noopener'
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

  if (card.type === 'video') {
    return <CardVideo card={card} className={className} description={description} />;
  } else if (card.type === 'photo') {
    return <CardPhoto trimmedTitle={trimmedTitle} onOpenMedia={onOpenMedia} card={card} className={className} description={description} />;
  }
  return <CardLink card={card} className={className} description={description} />;

};

export default Card;
