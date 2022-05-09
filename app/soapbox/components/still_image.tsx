import classNames from 'classnames';
import React, { useRef } from 'react';

import { useSettings } from 'soapbox/hooks';

interface IStillImage {
  /** Image alt text. */
  alt?: string,
  /** Extra class names for the outer <div> container. */
  className?: string,
  /** URL to the image */
  src: string,
  /** Extra CSS styles on the outer <div> element. */
  style?: React.CSSProperties,
}

/** Renders images on a canvas, only playing GIFs if autoPlayGif is enabled. */
const StillImage: React.FC<IStillImage> = ({ alt, className, src, style }) => {
  const settings = useSettings();
  const autoPlayGif = settings.get('autoPlayGif');

  const canvas = useRef<HTMLCanvasElement>(null);
  const img    = useRef<HTMLImageElement>(null);

  const hoverToPlay = (
    src && !autoPlayGif && (src.endsWith('.gif') || src.startsWith('blob:'))
  );

  const handleImageLoad = () => {
    if (hoverToPlay && canvas.current && img.current) {
      canvas.current.width  = img.current.naturalWidth;
      canvas.current.height = img.current.naturalHeight;
      canvas.current.getContext('2d')?.drawImage(img.current, 0, 0);
    }
  };


  return (
    <div data-testid='still-image-container' className={classNames(className, 'still-image', { 'still-image--play-on-hover': hoverToPlay })} style={style}>
      <img src={src} alt={alt} ref={img} onLoad={handleImageLoad} />
      {hoverToPlay && <canvas ref={canvas} />}
    </div>
  );
};

export default StillImage;
