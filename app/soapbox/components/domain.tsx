import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { unblockDomain } from 'soapbox/actions/domain_blocks';

import Icon from './icon';
import { Button } from './ui';

const messages = defineMessages({
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
});

interface IDomain {
  domain: string,
}

const Domain: React.FC<IDomain> = ({ domain }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const handleDomainUnblock = () => {
    dispatch(unblockDomain(domain));
  };

  return (
    <div className='domain'>
      <div className='domain__wrapper flex justify-between items-center'>
        <div className='flex gap-1 items-center'>
          <Icon src={require('@tabler/icons/world.svg')} />
          <strong className='text-gray-700 dark:text-white'>{domain}</strong>
        </div>

        <div className='domain__buttons'>
          <Button theme='ghost' onClick={handleDomainUnblock}>
            <div className='flex gap-1 items-center'>
              <Icon src={require('@tabler/icons/lock-open.svg')} />
              <span>
                { intl.formatMessage(messages.unblockDomain) }
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Domain;
