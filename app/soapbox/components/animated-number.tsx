import React, { useEffect, useState } from 'react';
import { FormattedNumber } from 'react-intl';
import { TransitionMotion, spring } from 'react-motion';

import { useSettings } from 'soapbox/hooks';

const obfuscatedCount = (count: number) => {
  if (count < 0) {
    return 0;
  } else if (count <= 1) {
    return count;
  } else {
    return '1+';
  }
};

interface IAnimatedNumber {
  value: number;
  obfuscate?: boolean;
}

const AnimatedNumber: React.FC<IAnimatedNumber> = ({ value, obfuscate }) => {
  const reduceMotion = useSettings().get('reduceMotion');

  const [direction, setDirection] = useState(1);
  const [displayedValue, setDisplayedValue] = useState<number>(value);

  useEffect(() => {
    if (displayedValue !== undefined) {
      if (value > displayedValue) setDirection(1);
      else if (value < displayedValue) setDirection(-1);
    }
    setDisplayedValue(value);
  }, [value]);

  const willEnter = () => ({ y: -1 * direction });

  const willLeave = () => ({ y: spring(1 * direction, { damping: 35, stiffness: 400 }) });

  if (reduceMotion) {
    return obfuscate ? <>{obfuscatedCount(displayedValue)}</> : <FormattedNumber value={displayedValue} />;
  }

  const styles = [{
    key: `${displayedValue}`,
    data: displayedValue,
    style: { y: spring(0, { damping: 35, stiffness: 400 }) },
  }];

  return (
    <TransitionMotion styles={styles} willEnter={willEnter} willLeave={willLeave}>
      {items => (
        <span className='inline-flex flex-col items-stretch relative overflow-hidden'>
          {items.map(({ key, data, style }) => (
            <span key={key} style={{ position: (direction * style.y) > 0 ? 'absolute' : 'static', transform: `translateY(${style.y * 100}%)` }}>{obfuscate ? obfuscatedCount(data) : <FormattedNumber value={data} />}</span>
          ))}
        </span>
      )}
    </TransitionMotion>
  );
};

export default AnimatedNumber;