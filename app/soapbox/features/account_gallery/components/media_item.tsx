import classNames from 'classnames';
import React, { useState } from 'react';

import Blurhash from 'soapbox/components/blurhash';
import Icon from 'soapbox/components/icon';
import StillImage from 'soapbox/components/still_image';
import { useSettings } from 'soapbox/hooks';
import { isIOS } from 'soapbox/is_mobile';

import type { Attachment } from 'soapbox/types/entities';

interface IMediaItem {
  attachment: Attachment,
  displayWidth: number,
  onOpenMedia: (attachment: Attachment) => void,
}

const MediaItem: React.FC<IMediaItem> = ({ attachment, displayWidth, onOpenMedia }) => {
  const settings = useSettings();
  const autoPlayGif = settings.get('autoPlayGif');
  const displayMedia = settings.get('displayMedia');

  const [visible, setVisible] = useState<boolean>(displayMedia !== 'hide_all' && !attachment.status?.sensitive || displayMedia === 'show_all');

  const handleMouseEnter: React.MouseEventHandler<HTMLVideoElement> = e => {
    const video = e.target as HTMLVideoElement;
    if (hoverToPlay()) {
      video.play();
    }
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLVideoElement> = e => {
    const video = e.target as HTMLVideoElement;
    if (hoverToPlay()) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const hoverToPlay = () => {
    return !autoPlayGif && ['gifv', 'video'].includes(attachment.type);
  };

  const handleClick: React.MouseEventHandler = e => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();

      if (visible) {
        onOpenMedia(attachment);
      } else {
        setVisible(true);
      }
    }
  };

  const width  = `${Math.floor((displayWidth - 4) / 3) - 4}px`;
  const height = width;
  const status = attachment.get('status');
  const title = status.get('spoiler_text') || attachment.get('description');

  let thumbnail: React.ReactNode = '';
  let icon;

  if (attachment.type === 'unknown') {
    // Skip
  } else if (attachment.type === 'image') {
    const focusX = Number(attachment.getIn(['meta', 'focus', 'x'])) || 0;
    const focusY = Number(attachment.getIn(['meta', 'focus', 'y'])) || 0;
    const x = ((focusX /  2) + .5) * 100;
    const y = ((focusY / -2) + .5) * 100;

    thumbnail = (
      <StillImage
        src={attachment.preview_url}
        alt={attachment.description}
        style={{ objectPosition: `${x}% ${y}%` }}
      />
    );
  } else if (['gifv', 'video'].indexOf(attachment.type) !== -1) {
    const conditionalAttributes: React.VideoHTMLAttributes<HTMLVideoElement> = {};
    if (isIOS()) {
      conditionalAttributes.playsInline = true;
    }
    if (autoPlayGif) {
      conditionalAttributes.autoPlay = true;
    }
    thumbnail = (
      <div className={classNames('media-gallery__gifv', { autoplay: autoPlayGif })}>
        <video
          className='media-gallery__item-gifv-thumbnail'
          aria-label={attachment.description}
          title={attachment.description}
          role='application'
          src={attachment.url}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          loop
          muted
          {...conditionalAttributes}
        />

        <span className='media-gallery__gifv__label'>GIF</span>
      </div>
    );
  } else if (attachment.type === 'audio') {
    const remoteURL = attachment.remote_url || '';
    const fileExtensionLastIndex = remoteURL.lastIndexOf('.');
    const fileExtension = remoteURL.substr(fileExtensionLastIndex + 1).toUpperCase();
    thumbnail = (
      <div className='media-gallery__item-thumbnail'>
        <span className='media-gallery__item__icons'><Icon src={require('@tabler/icons/volume.svg')} /></span>
        <span className='media-gallery__file-extension__label'>{fileExtension}</span>
      </div>
    );
  }

  if (!visible) {
    icon = (
      <span className='account-gallery__item__icons'>
        <Icon src={require('@tabler/icons/eye-off.svg')} />
      </span>
    );
  }

  return (
    <div className='account-gallery__item' style={{ width, height }}>
      <a className='media-gallery__item-thumbnail rounded overflow-hidden' href={status.get('url')} target='_blank' onClick={handleClick} title={title}>
        <Blurhash
          hash={attachment.get('blurhash')}
          className={classNames('media-gallery__preview', {
            'media-gallery__preview--hidden': visible,
          })}
        />
        {visible && thumbnail}
        {!visible && icon}
      </a>
    </div>
  );
};

export default MediaItem;
