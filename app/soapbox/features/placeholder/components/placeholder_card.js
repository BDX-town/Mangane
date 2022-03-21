import classNames from 'classnames';
import * as React from 'react';

import { randomIntFromInterval, generateText } from '../utils';

const PlaceholderCard = () => (
  <div className={classNames('status-card', {
    'animate-pulse': true,
  })}
  >
    <div className='w-2/5 bg-slate-200 rounded-l'>&nbsp;</div>

    <div className='w-3/5 p-4 flex flex-col justify-between text-slate-200 break-words'>
      <p>{generateText(randomIntFromInterval(5, 25))}</p>
      <p>{generateText(randomIntFromInterval(5, 75))}</p>
      <p>{generateText(randomIntFromInterval(5, 15))}</p>
    </div>
  </div>
);

export default React.memo(PlaceholderCard);
