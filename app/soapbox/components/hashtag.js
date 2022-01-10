import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { Sparklines, SparklinesCurve } from 'react-sparklines';

import { shortNumberFormat } from '../utils/numbers';

import Permalink from './permalink';

const Hashtag = ({ hashtag }) => {
  const count = Number(hashtag.getIn(['history', 0, 'accounts']));

  return (
    <div className='trends__item'>
      <div className='trends__item__name'>
        <Permalink href={hashtag.get('url')} to={`/tags/${hashtag.get('name')}`}>
          #<span>{hashtag.get('name')}</span>
        </Permalink>

        {hashtag.get('history') && (
          <div className='trends__item__count'>
            <FormattedMessage
              id='trends.count_by_accounts'
              defaultMessage='{count} {rawCount, plural, one {person} other {people}} talking'
              values={{
                rawCount: count,
                count: <strong>{shortNumberFormat(count)}</strong>,
              }}
            />
          </div>
        )}
      </div>

      {hashtag.get('history') && (
        <div className='trends__item__sparkline'>
          <Sparklines width={50} height={28} data={hashtag.get('history').reverse().map(day => day.get('uses')).toArray()}>
            <SparklinesCurve style={{ fill: 'none' }} />
          </Sparklines>
        </div>
      )}
    </div>
  );
};

Hashtag.propTypes = {
  hashtag: ImmutablePropTypes.map.isRequired,
};

export default Hashtag;
