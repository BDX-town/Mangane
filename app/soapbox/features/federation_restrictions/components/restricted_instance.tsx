import classNames from 'classnames';
import React, { useState } from 'react';

import Icon from 'soapbox/components/icon';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetRemoteInstance } from 'soapbox/selectors';

import InstanceRestrictions from './instance_restrictions';

const getRemoteInstance = makeGetRemoteInstance();

interface IRestrictedInstance {
  host: string,
}

const RestrictedInstance: React.FC<IRestrictedInstance> = ({ host }) => {
  const remoteInstance: any = useAppSelector((state) => getRemoteInstance(state, host));

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded: React.MouseEventHandler<HTMLAnchorElement> = e => {
    setExpanded((value) => !value);
    e.preventDefault();
  };

  return (
    <div className={classNames('restricted-instance', {
      'restricted-instance--reject': remoteInstance.getIn(['federation', 'reject']),
      'restricted-instance--expanded': expanded,
    })}
    >
      <a href='#' className='restricted-instance__header' onClick={toggleExpanded}>
        <div className='restricted-instance__icon'>
          <Icon src={expanded ? require('@tabler/icons/caret-down.svg') : require('@tabler/icons/caret-right.svg')} />
        </div>
        <div className='restricted-instance__host'>
          {remoteInstance.get('host')}
        </div>
      </a>
      <div className='restricted-instance__restrictions'>
        <InstanceRestrictions remoteInstance={remoteInstance} />
      </div>
    </div>
  );
};

export default RestrictedInstance;
