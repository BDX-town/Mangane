import classNames from 'classnames';
import { supportsPassiveEvents } from 'detect-passive-events';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { spring } from 'react-motion';
// @ts-ignore
import Overlay from 'react-overlays/lib/Overlay';

import { IconButton, Icon } from 'soapbox/components/ui';
import { useFeatures, useLogo } from 'soapbox/hooks';

import Motion from '../../ui/util/optional_motion';

const messages = defineMessages({
  public_short: { id: 'privacy.public.short', defaultMessage: 'Public' },
  public_long: { id: 'privacy.public.long', defaultMessage: 'Post to public timelines' },
  unlisted_short: { id: 'privacy.unlisted.short', defaultMessage: 'Unlisted' },
  unlisted_long: { id: 'privacy.unlisted.long', defaultMessage: 'Do not post to public timelines' },
  local_short: { id: 'privacy.local.short', defaultMessage: 'Local-only' },
  local_long: { id: 'privacy.local.long', defaultMessage: 'Status is only visible to people on this instance' },
  private_short: { id: 'privacy.private.short', defaultMessage: 'Followers-only' },
  private_long: { id: 'privacy.private.long', defaultMessage: 'Post to followers only' },
  direct_short: { id: 'privacy.direct.short', defaultMessage: 'Direct' },
  direct_long: { id: 'privacy.direct.long', defaultMessage: 'Post to mentioned users only' },
  change_privacy: { id: 'privacy.change', defaultMessage: 'Adjust post privacy' },
});

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;

interface IPrivacyDropdownMenu {
  style?: React.CSSProperties,
  items: any[],
  value: string,
  placement: string,
  onClose: () => void,
  onChange: (value: string | null) => void,
  unavailable?: boolean,
}

const PrivacyDropdownMenu: React.FC<IPrivacyDropdownMenu> = ({ style, items, placement, value, onClose, onChange }) => {
  const node = useRef<HTMLDivElement>(null);
  const focusedItem = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState<boolean>(false);

  const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
    if (node.current && !node.current.contains(e.target as HTMLElement)) {
      onClose();
    }
  };

  const handleKeyDown: React.KeyboardEventHandler = e => {
    const value = e.currentTarget.getAttribute('data-index');
    const index = items.findIndex(item => item.value === value);
    let element = null;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'Enter':
        handleClick(e);
        break;
      case 'ArrowDown':
        element = node.current?.childNodes[index + 1] || node.current?.firstChild;
        break;
      case 'ArrowUp':
        element = node.current?.childNodes[index - 1] || node.current?.lastChild;
        break;
      case 'Tab':
        if (e.shiftKey) {
          element = node.current?.childNodes[index - 1] || node.current?.lastChild;
        } else {
          element = node.current?.childNodes[index + 1] || node.current?.firstChild;
        }
        break;
      case 'Home':
        element = node.current?.firstChild;
        break;
      case 'End':
        element = node.current?.lastChild;
        break;
    }

    if (element) {
      (element as HTMLElement).focus();
      onChange((element as HTMLElement).getAttribute('data-index'));
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleClick: React.EventHandler<any> = (e: MouseEvent | KeyboardEvent) => {
    const value = (e.currentTarget as HTMLElement)?.getAttribute('data-index');

    e.preventDefault();

    onClose();
    onChange(value);
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick, false);
    document.addEventListener('touchend', handleDocumentClick, listenerOptions);

    focusedItem.current?.focus({ preventScroll: true });
    setMounted(true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
      document.removeEventListener('touchend', handleDocumentClick);
    };
  }, []);

  return (
    <Motion defaultStyle={{ opacity: 0, scaleX: 0.85, scaleY: 0.75 }} style={{ opacity: spring(1, { damping: 35, stiffness: 400 }), scaleX: spring(1, { damping: 35, stiffness: 400 }), scaleY: spring(1, { damping: 35, stiffness: 400 }) }}>
      {({ opacity, scaleX, scaleY }) => (
        // It should not be transformed when mounting because the resulting
        // size will be used to determine the coordinate of the menu by
        // react-overlays
        <div className={`privacy-dropdown__dropdown ${placement}`} style={{ ...style, opacity: opacity, transform: mounted ? `scale(${scaleX}, ${scaleY})` : undefined }} role='listbox' ref={node}>
          {items.map(item => (
            <div role='option' tabIndex={0} key={item.value} data-index={item.value} onKeyDown={handleKeyDown} onClick={handleClick} className={classNames('privacy-dropdown__option', { active: item.value === value })} aria-selected={item.value === value} ref={item.value === value ? focusedItem : null}>
              <div className='privacy-dropdown__option__icon'>
                <Icon size={16} src={item.icon} />
              </div>

              <div className='privacy-dropdown__option__content'>
                <strong>{item.text}</strong>
                {item.meta}
              </div>
            </div>
          ))}
        </div>
      )}
    </Motion>
  );
};

interface IPrivacyDropdown {
  isUserTouching: () => boolean,
  isModalOpen: boolean,
  onModalOpen: (opts: any) => void,
  onModalClose: () => void,
  value: string,
  onChange: (value: string | null) => void,
  unavailable: boolean,
}

const PrivacyDropdown: React.FC<IPrivacyDropdown> = ({
  isUserTouching,
  onChange,
  onModalClose,
  onModalOpen,
  value,
  unavailable,
}) => {
  const intl = useIntl();
  const node = useRef<HTMLDivElement>(null);
  const activeElement = useRef<HTMLElement | null>(null);
  const logo = useLogo();
  const features = useFeatures();

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('bottom');

  const options = [
    { icon: require('@tabler/icons/world.svg'), value: 'public', text: intl.formatMessage(messages.public_short), meta: intl.formatMessage(messages.public_long) },
    { icon: require('@tabler/icons/eye-off.svg'), value: 'unlisted', text: intl.formatMessage(messages.unlisted_short), meta: intl.formatMessage(messages.unlisted_long) },
    ...(features.localOnlyPrivacy ? [{ icon: logo, value: 'local', text: intl.formatMessage(messages.local_short), meta: intl.formatMessage(messages.local_long) }] : []),
    { icon: require('@tabler/icons/lock.svg'), value: 'private', text: intl.formatMessage(messages.private_short), meta: intl.formatMessage(messages.private_long) },
    { icon: require('@tabler/icons/mail.svg'), value: 'direct', text: intl.formatMessage(messages.direct_short), meta: intl.formatMessage(messages.direct_long) },
  ];

  const handleToggle: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isUserTouching()) {
      if (open) {
        onModalClose();
      } else {
        onModalOpen({
          actions: options.map(option => ({ ...option, active: option.value === value })),
          onClick: handleModalActionClick,
        });
      }
    } else {
      const { top } = e.currentTarget.getBoundingClientRect();
      if (open) {
        activeElement.current?.focus();
      }
      setPlacement(top * 2 < innerHeight ? 'bottom' : 'top');
      setOpen(!open);
    }
    e.stopPropagation();
  };

  const handleModalActionClick: React.MouseEventHandler = (e) => {
    e.preventDefault();

    const { value } = options[e.currentTarget.getAttribute('data-index') as any];

    onModalClose();
    onChange(value);
  };

  const handleKeyDown: React.KeyboardEventHandler = e => {
    switch (e.key) {
      case 'Escape':
        handleClose();
        break;
    }
  };

  const handleMouseDown = () => {
    if (!open) {
      activeElement.current = document.activeElement as HTMLElement | null;
    }
  };

  const handleButtonKeyDown: React.KeyboardEventHandler = (e) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        handleMouseDown();
        break;
    }
  };

  const handleClose = () => {
    if (open) {
      activeElement.current?.focus();
    }
    setOpen(false);
  };

  if (unavailable) {
    return null;
  }

  const valueOption = options.find(item => item.value === value);

  return (
    <div className={classNames('privacy-dropdown', placement, { active: open })} onKeyDown={handleKeyDown} ref={node}>
      <div className={classNames('privacy-dropdown__value', { active: valueOption && options.indexOf(valueOption) === 0 })}>
        <IconButton
          className='text-gray-400 hover:text-gray-600'
          src={valueOption?.icon}
          title={intl.formatMessage(messages.change_privacy)}
          onClick={handleToggle}
          onMouseDown={handleMouseDown}
          onKeyDown={handleButtonKeyDown}
        />
      </div>

      <Overlay show={open} placement={placement} target={node.current}>
        <PrivacyDropdownMenu
          items={options}
          value={value}
          onClose={handleClose}
          onChange={onChange}
          placement={placement}
        />
      </Overlay>
    </div>
  );
};

export default PrivacyDropdown;
