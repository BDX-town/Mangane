import classNames from 'classnames';
import { supportsPassiveEvents } from 'detect-passive-events';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { usePopper } from 'react-popper';
import { useDispatch } from 'react-redux';

import { closeModal, openModal } from 'soapbox/actions/modals';
import { Button, Icon } from 'soapbox/components/ui';
import { useAppSelector, useFeatures, useLogo } from 'soapbox/hooks';
import { isUserTouching } from 'soapbox/is_mobile';

const messages = defineMessages({
  public_short: { id: 'language.public.short', defaultMessage: 'Public' },
  public_long: { id: 'language.public.long', defaultMessage: 'Post to public timelines' },
  unlisted_short: { id: 'language.unlisted.short', defaultMessage: 'Unlisted' },
  unlisted_long: { id: 'language.unlisted.long', defaultMessage: 'Do not post to public timelines' },
  local_short: { id: 'language.local.short', defaultMessage: 'Local-only' },
  local_long: { id: 'language.local.long', defaultMessage: 'Status is only visible to people on this instance' },
  private_short: { id: 'language.private.short', defaultMessage: 'Followers-only' },
  private_long: { id: 'language.private.long', defaultMessage: 'Post to followers only' },
  direct_short: { id: 'language.direct.short', defaultMessage: 'Direct' },
  direct_long: { id: 'language.direct.long', defaultMessage: 'Post to mentioned users only' },
  change_language: { id: 'language.change', defaultMessage: 'Adjust post language' },
});

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;

interface ILanguageDropdownMenu {
  style?: React.CSSProperties,
  items: any[],
  value: string,
  onClose: () => void,
  onChange: (value: string | null) => void,
  unavailable?: boolean,
  reference: HTMLElement,
}

const LanguageDropdownMenu: React.FC<ILanguageDropdownMenu> = ({ style, items, value, onClose, onChange, reference }) => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const focusedItem = useRef<HTMLDivElement>(null);


  const { top } = reference.getBoundingClientRect();

  const { attributes, styles } = usePopper(reference, node, { placement: top * 2 < window.innerHeight ? 'bottom' : 'top' });

  const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
    if (node && !node.contains(e.target as HTMLElement)) {
      onClose();
    }
  };

  const handleKeyDown: React.KeyboardEventHandler = e => {
    const value = e.currentTarget.getAttribute('data-index');
    const index = items.findIndex(item => item.value === value);
    let element: ChildNode | undefined | null = undefined;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'Enter':
        handleClick(e);
        break;
      case 'ArrowDown':
        element = node?.childNodes[index + 1] || node?.firstChild;
        break;
      case 'ArrowUp':
        element = node?.childNodes[index - 1] || node?.lastChild;
        break;
      case 'Tab':
        if (e.shiftKey) {
          element = node?.childNodes[index - 1] || node?.lastChild;
        } else {
          element = node?.childNodes[index + 1] || node?.firstChild;
        }
        break;
      case 'Home':
        element = node?.firstChild;
        break;
      case 'End':
        element = node?.lastChild;
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

    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
      document.removeEventListener('touchend', handleDocumentClick);
    };
  }, []);

  return (
    <div className={'language-dropdown__dropdown absolute bg-white dark:bg-slate-900 z-[1000] rounded-md shadow-lg ml-10 text-sm'} style={{ ...style, ...styles.popper }} role='listbox' ref={setNode} {...attributes.popper}>
      {items.map(item => (
        <div role='option' tabIndex={0} key={item.value} data-index={item.value} onKeyDown={handleKeyDown} onClick={handleClick} className={classNames('language-dropdown__option', { active: item.value === value })} aria-selected={item.value === value} ref={item.value === value ? focusedItem : null}>
          <div className='language-dropdown__option__icon'>
            <Icon size={16} src={item.icon} />
          </div>

          <div className='language-dropdown__option__content'>
            <strong>{item.text}</strong>
            {item.meta}
          </div>
        </div>
      ))}
    </div>
  );
};

interface ILanguageDropdown {
  value: string,
  onChange: (value: string | null) => void,
}

const LanguageDropdown: React.FC<ILanguageDropdown> = ({
  onChange,
  value,
}) => {
  const intl = useIntl();
  const node = useRef<HTMLDivElement>(null);
  const activeElement = useRef<HTMLElement | null>(null);
  const logo = useLogo();
  const dispatch = useDispatch();
  const features = useFeatures();

  const [open, setOpen] = useState(false);

  const options = [
    { icon: require('@tabler/icons/world.svg'), value: 'public', text: intl.formatMessage(messages.public_short), meta: intl.formatMessage(messages.public_long) },
    { icon: require('@tabler/icons/eye-off.svg'), value: 'unlisted', text: intl.formatMessage(messages.unlisted_short), meta: intl.formatMessage(messages.unlisted_long) },
    ...(features.localOnlyPrivacy ? [{ icon: logo, value: 'local', text: intl.formatMessage(messages.local_short), meta: intl.formatMessage(messages.local_long) }] : []),
    { icon: require('@tabler/icons/lock.svg'), value: 'private', text: intl.formatMessage(messages.private_short), meta: intl.formatMessage(messages.private_long) },
    { icon: require('@tabler/icons/mail.svg'), value: 'direct', text: intl.formatMessage(messages.direct_short), meta: intl.formatMessage(messages.direct_long) },
  ];

  const handleToggle: React.MouseEventHandler<HTMLButtonElement> = React.useCallback((e) => {
    e.stopPropagation();
    if (isUserTouching()) {
      if (open) dispatch(closeModal('ACTIONS'));
      else dispatch(openModal('ACTIONS', { actions: options.map(option => ({ ...option, active: option.value === value })), onClick: handleModalActionClick }));
    } else {
      if (open) activeElement.current?.focus();
      setOpen(!open);
    }
  }, [open, dispatch]);

  const handleModalActionClick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    const { value } = options[e.currentTarget.getAttribute('data-index') as any];
    dispatch(closeModal('ACTIONS'));
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

  const valueOption = options.find(item => item.value === value);

  return (
    <div className={classNames('language-dropdown', { active: open })} onKeyDown={handleKeyDown} ref={node}>
      <div className={classNames('language-dropdown__value', { active: valueOption && options.indexOf(valueOption) === 0 })}>
        <button
          className='text-gray-400 hover:text-gray-600 border-0 bg-transparent px-1 font-bold'
          onClick={handleToggle}
          onMouseDown={handleMouseDown}
          onKeyDown={handleButtonKeyDown}
        >
          fr
        </button>
      </div>

      {
        open && (
          <LanguageDropdownMenu
            items={options}
            value={value}
            onClose={handleClose}
            onChange={onChange}
            reference={node.current as HTMLElement}
          />
        )
      }
    </div>
  );
};

export default LanguageDropdown;
