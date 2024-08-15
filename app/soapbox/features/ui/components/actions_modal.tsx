import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from 'soapbox/components/icon';

import type { Menu, MenuItem } from 'soapbox/components/dropdown_menu';
import type { Status as StatusEntity } from 'soapbox/types/entities';

interface IActionsModal {
  status: StatusEntity,
  actions: Menu,
  onClick: () => void,
  onClose: () => void,
}

const ActionsModal: React.FC<IActionsModal> = ({ status, actions, onClick, onClose }) => {
  const renderAction = (action: MenuItem | null, i: number) => {
    if (action === null) {
      return <li key={`sep-${i}`} className='dropdown-menu__separator' />;
    }

    const { icon = null, text, meta = null, active = false, href = '#', isLogout, destructive } = action;

    const Comp = href === '#' ? 'button' : 'a';
    const compProps = href === '#' ? { onClick: onClick } : { href: href };

    return (
      <li key={`${text}-${i}`}>
        <Comp
          {...compProps}
          rel='noopener'
          data-index={i}
          className={classNames({ active, destructive }, 'w-full')}
          data-method={isLogout ? 'delete' : null}
        >
          {icon && <Icon title={text as string} src={icon} role='presentation' tabIndex={-1} />}
          <div>
            <div className={classNames({ 'actions-modal__item-label': !!meta })}>{text}</div>
            <div>{meta}</div>
          </div>
        </Comp>
      </li>
    );
  };

  return (
    <div className='modal-root__modal actions-modal rounded-t-lg relative overflow-hidden w-full max-h-full mt-auto max-auto bg-white dark:bg-slate-800'>
      <ul className={classNames('w-full', { 'with-status': !!status })}>
        {actions && actions.map(renderAction)}

        <li className='dropdown-menu__separator' />

        <li>
          <button type='button' onClick={onClose}>
            <FormattedMessage id='lightbox.close' defaultMessage='Cancel' />
          </button>
        </li>
      </ul>
    </div>);
};

export default ActionsModal;
