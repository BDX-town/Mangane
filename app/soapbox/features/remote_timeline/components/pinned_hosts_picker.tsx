'use strict';

import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import { useSettings } from 'soapbox/hooks';

interface IPinnedHostsPicker {
  /** The active host among pinned hosts. */
  host: string,
}

const PinnedHostsPicker: React.FC<IPinnedHostsPicker> = ({ host: activeHost }) => {
  const settings = useSettings();
  const pinnedHosts = settings.getIn(['remote_timeline', 'pinnedHosts']) as any;

  if (!pinnedHosts || pinnedHosts.isEmpty()) return null;

  return (
    <div className='pinned-hosts-picker'>
      {pinnedHosts.map((host: any) => (
        <div className={classNames('pinned-host', { 'active': host === activeHost })} key={host}>
          <Link to={`/timeline/${host}`}>{host}</Link>
        </div>
      ))}
    </div>
  );
};

export default PinnedHostsPicker;
