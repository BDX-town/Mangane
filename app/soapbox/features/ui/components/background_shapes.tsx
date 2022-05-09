import classNames from 'classnames';
import React from 'react';

interface IBackgroundShapes {
  /** Whether the shapes should be absolute positioned or fixed. */
  position?: 'fixed' | 'absolute',
}

/** Gradient that appears in the background of the UI. */
const BackgroundShapes: React.FC<IBackgroundShapes> = ({ position = 'fixed' }) => (
  <div className={classNames(position, 'top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none')}>
    <div className='flex-none flex justify-center'>
      <svg width='1754' height='1336' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <filter x='-18.1%' y='-15.3%' width='136.3%' height='130.7%' filterUnits='objectBoundingBox' id='c'>
            <feGaussianBlur stdDeviation='50' in='SourceGraphic' />
          </filter>
          <filter x='-16.5%' y='-11.7%' width='133%' height='123.3%' filterUnits='objectBoundingBox' id='d'>
            <feGaussianBlur stdDeviation='50' in='SourceGraphic' />
          </filter>
          <path id='a' d='M0 0h1754v1336H0z' />
        </defs>
        <g fill='none' fillRule='evenodd'>
          <mask id='b' fill='#fff'>
            <use xlinkHref='#a' />
          </mask>
          <g mask='url(#b)'>
            <path className='fill-gradient-end opacity-10 dark:fill-gradient-end dark:opacity-5' d='M1257.79 335.852C1262 527.117 897.55 530.28 792.32 977.19 600.48 981.41 435.29 545.31 431.08 354.046 426.871 162.782 578.976 4.31 770.815.088c191.844-4.222 482.764 144.5 486.974 335.764Z' fillRule='nonzero' filter='url(#c)' transform='translate(309.54 -367.538)' />
            <path className='fill-gradient-start opacity-10 dark:fill-gradient-start dark:opacity-5' d='M71.127 1126.654c206.164 179.412 502.452 211.232 661.777 71.072 159.325-140.163 295.165-510.155 8.23-504.412-320.079 6.405-381.35-817.422-540.675-677.258-31 368-335.497 931.182-129.332 1110.598Z' fillRule='nonzero' filter='url(#d)' transform='translate(309.54 -141.056)' />
          </g>
        </g>
      </svg>
    </div>
  </div>
);

export default BackgroundShapes;
