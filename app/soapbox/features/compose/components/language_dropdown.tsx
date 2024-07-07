import classNames from 'classnames';
import { supportsPassiveEvents } from 'detect-passive-events';
import ISO6391 from 'iso-639-1';
import { debounce } from 'lodash';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePopper } from 'react-popper';
import { useDispatch } from 'react-redux';

import { closeModal, openModal } from 'soapbox/actions/modals';
import { Input } from 'soapbox/components/ui';
import { isUserTouching } from 'soapbox/is_mobile';

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
  const list = useRef<HTMLDivElement>(null);
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
        element = list.current?.childNodes[index + 1] || list.current?.firstChild;
        break;
      case 'ArrowUp':
        element = list.current?.childNodes[index - 1] || list.current?.lastChild;
        break;
      case 'Tab':
        if (e.shiftKey) {
          element = list.current?.childNodes[index - 1] || list.current?.lastChild;
        } else {
          element = list.current?.childNodes[index + 1] || list.current?.firstChild;
        }
        break;
      case 'Home':
        element = list.current?.firstChild;
        break;
      case 'End':
        element = list.current?.lastChild;
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

    focusedItem.current?.focus();



    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
      document.removeEventListener('touchend', handleDocumentClick);
    };
  }, []);

  const [currentItems, setCurrentItems] = useState(items);

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(debounce((e) => {
    const search = e.target.value.toUpperCase().normalize('NFC');
    if (search.length === 0) {
      setCurrentItems(items);
      return;
    }
    setCurrentItems(items.filter((i) => i.label.toUpperCase().normalize('NFC').indexOf(search) !== -1));
  }, 500), [items]);


  return (
    <div className={'absolute bg-white dark:bg-slate-900 z-[1000] rounded-md shadow-lg ml-10 text-sm'} style={{ ...style, ...styles.popper }} role='listbox' ref={setNode} {...attributes.popper}>
      <div className='p-2'>
        <Input autoFocus onChange={onSearchChange} />
      </div>
      <div className='h-[300px] overflow-y-auto' ref={list}>
        {currentItems.map(item => (
          <div role='option' tabIndex={0} key={item.value} data-index={item.value} onKeyDown={handleKeyDown} onClick={handleClick} className={classNames('p-3 cursor-pointer hover:bg-gray-100', { active: item.value === value })} aria-selected={item.value === value} ref={item.value === value ? focusedItem : null}>
            <div className='language-dropdown__option__content'>
              <strong>{item.value}</strong>&nbsp;{item.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

interface ILanguageDropdown {
  value: string,
  onChange: (value: string | null) => void,
  defaultValue: string,
}

const ALL_OPTIONS = ISO6391.getAllCodes().map((code) => ({ value: code, label: ISO6391.getNativeName(code) }));

const LanguageDropdown: React.FC<ILanguageDropdown> = ({
  onChange,
  defaultValue,
  value,
}) => {
  const node = useRef<HTMLDivElement>(null);
  const activeElement = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleToggle: React.MouseEventHandler<HTMLButtonElement> = React.useCallback((e) => {
    e.stopPropagation();
    if (isUserTouching()) {
      if (open) dispatch(closeModal('ACTIONS'));
      else dispatch(openModal('ACTIONS', { actions: ALL_OPTIONS.map(option => ({ ...option, active: option.value === value })), onClick: handleModalActionClick }));
    } else {
      if (open) activeElement.current?.focus();
      setOpen(!open);
    }
  }, [open, dispatch]);

  const handleModalActionClick: React.MouseEventHandler = (e) => {
    // e.preventDefault();
    // const { value } = options[e.currentTarget.getAttribute('data-index') as any];
    // dispatch(closeModal('ACTIONS'));
    // onChange(value);
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

  return (
    <div className={classNames('language-dropdown', { active: open })} onKeyDown={handleKeyDown} ref={node}>
      <div className={classNames('language-dropdown__value')}>
        <button
          className='text-gray-400 hover:text-gray-600 border-0 bg-transparent px-1 font-bold'
          onClick={handleToggle}
          onMouseDown={handleMouseDown}
          onKeyDown={handleButtonKeyDown}
        >
          { value || defaultValue }
        </button>
      </div>

      {
        open && (
          <LanguageDropdownMenu
            items={ALL_OPTIONS}
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
