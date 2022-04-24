import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Text } from 'soapbox/components/ui';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';

import type { Menu } from 'soapbox/components/dropdown_menu';

const messages = defineMessages({
  collapse: { id: 'accordion.collapse', defaultMessage: 'Collapse' },
  expand: { id: 'accordion.expand', defaultMessage: 'Expand' },
});

interface IAccordion {
  headline: React.ReactNode,
  children?: string | React.ReactNode,
  menu?: Menu,
  expanded?: boolean,
  onToggle?: (value: boolean) => void,
}

const Accordion: React.FC<IAccordion> = ({ headline, children, menu, expanded = false, onToggle = () => {} }) => {
  const intl = useIntl();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onToggle(!expanded);
    e.preventDefault();
  };

  return (
    <div className={classNames('accordion', { 'accordion--expanded': expanded })}>
      {menu && (
        <div className='accordion__menu'>
          <DropdownMenu items={menu} src={require('@tabler/icons/icons/dots-vertical.svg')} />
        </div>
      )}
      <button
        type='button'
        className='accordion__title'
        onClick={handleToggle}
        title={intl.formatMessage(expanded ? messages.collapse : messages.expand)}
      >
        <Text weight='bold'>{headline}</Text>
      </button>
      <div className='accordion__content'>
        <Text>{children}</Text>
      </div>
    </div>
  );
};

export default Accordion;
