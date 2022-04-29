import { decode } from 'blurhash';
import React, { useRef, useEffect } from 'react';

interface IBlurhash {
  /** Hash to render */
  hash: string | null | undefined,
  /**  Width of the blurred region in pixels. Defaults to 32. */
  width?: number,
  /** Height of the blurred region in pixels. Defaults to width. */
  height?: number,
  /**
   * Whether dummy mode is enabled. If enabled, nothing is rendered
   * and canvas left untouched.
   */
  dummy?: boolean,
  /** className of the canvas element. */
  className?: string,
}

/**
 * Renders a blurhash in a canvas element.
 * @see {@link https://blurha.sh/}
 */
const Blurhash: React.FC<IBlurhash> = ({
  hash,
  width = 32,
  height = width,
  dummy = false,
  ...canvasProps
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (!canvas) return;

    // resets canvas
    canvas.width = canvas.width; // eslint-disable-line no-self-assign

    if (dummy || !hash) return;

    try {
      const pixels = decode(hash, width, height);
      const ctx = canvas.getContext('2d');
      const imageData = new ImageData(pixels, width, height);

      if (!ctx) return;
      ctx.putImageData(imageData, 0, 0);
    } catch (err) {
      console.error('Blurhash decoding failure', { err, hash });
    }
  }, [dummy, hash, width, height]);

  return (
    <canvas {...canvasProps} ref={canvasRef} width={width} height={height} />
  );
};

export default React.memo(Blurhash);
