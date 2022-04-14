import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import spring from 'react-motion/lib/spring';

import Icon from '../../../components/icon';
import StatusContent from '../../../components/status_content';
import { Stack } from '../../../components/ui';
import AccountContainer from '../../../containers/account_container';
import Motion from '../util/optional_motion';

const ActionsModal = ({ status, actions, onClick, onClose }) => {
  const renderAction = (action, i) => {
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
          className={classNames({ active, destructive })}
          data-method={isLogout ? 'delete' : null}
        >
          {icon && <Icon title={text} src={icon} role='presentation' tabIndex='-1' inverted />}
          <div>
            <div className={classNames({ 'actions-modal__item-label': !!meta })}>{text}</div>
            <div>{meta}</div>
          </div>
        </Comp>
      </li>
    );
  };

  return (
    <Motion defaultStyle={{ top: 100 }} style={{ top: spring(0) }}>
      {({ top }) => (
        <div className='modal-root__modal actions-modal' style={{ top: `${top}%` }}>
          {status && (
            <Stack space={2} className='p-4 bg-gray-50 dark:bg-slate-800 border-b border-solid border-gray-200 dark:border-gray-700'>
              <AccountContainer
                account={status.get('account')}
                showProfileHoverCard={false}
                timestamp={status.get('created_at')}
              />
              <StatusContent status={status} />
            </Stack>
          )}

          <ul className={classNames({ 'with-status': !!status })}>
            {actions && actions.map(renderAction)}

            <li className='dropdown-menu__separator' />

            <li>
              <button type='button' onClick={onClose}>
                <FormattedMessage id='lightbox.close' defaultMessage='Cancel' />
              </button>
            </li>
          </ul>
        </div>
      )}
    </Motion>
  );
};

ActionsModal.propTypes = {
  status: ImmutablePropTypes.record,
  actions: PropTypes.array,
  onClick: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default ActionsModal;
