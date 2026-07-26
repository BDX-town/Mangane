import classNames from 'classnames';
import React from 'react';

interface ISegmentedOption {
  disabled?: boolean,
  label: React.ReactNode,
  value: string,
}

interface ISegmentedControl {
  ariaLabel: string,
  className?: string,
  disabled?: boolean,
  onChange: (value: string) => void,
  options: ISegmentedOption[],
  value: string,
}

const nextEnabledIndex = (
  options: ISegmentedOption[],
  start: number,
  direction: 1 | -1,
): number => {
  if (options.length === 0) return -1;
  for (let distance = 1; distance <= options.length; distance += 1) {
    const candidate = (start + direction * distance + options.length) % options.length;
    if (!options[candidate].disabled) return candidate;
  }
  return -1;
};

/** Radio-group styled as a compact segmented control with roving focus. */
const SegmentedControl: React.FC<ISegmentedControl> = ({
  ariaLabel,
  className,
  disabled = false,
  onChange,
  options,
  value,
}) => {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = options.findIndex(option => option.value === value && !option.disabled);
  const fallbackIndex = options.findIndex(option => !option.disabled);
  const tabbableIndex = selectedIndex === -1 ? fallbackIndex : selectedIndex;

  const choose = (index: number) => {
    const option = options[index];
    if (!option || disabled || option.disabled) return;
    onChange(option.value);
    refs.current[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = nextEnabledIndex(options, index, 1);
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = nextEnabledIndex(options, index, -1);
    if (event.key === 'Home') next = options.findIndex(option => !option.disabled);
    if (event.key === 'End') {
      const reversed = [...options].reverse().findIndex(option => !option.disabled);
      next = reversed === -1 ? -1 : options.length - reversed - 1;
    }
    if (next === -1) return;
    event.preventDefault();
    choose(next);
  };

  return (
    <div
      role='radiogroup'
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={classNames('ds-segmented-control', className)}
    >
      {options.map((option, index) => {
        const checked = option.value === value;
        const unavailable = disabled || option.disabled;
        return (
          <button
            key={option.value}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type='button'
            role='radio'
            aria-checked={checked}
            disabled={unavailable}
            tabIndex={!disabled && index === tabbableIndex ? 0 : -1}
            className={classNames('ds-segmented-control__option', {
              'ds-segmented-control__option--selected': checked,
            })}
            onClick={() => choose(index)}
            onKeyDown={event => handleKeyDown(event, index)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;

export type { ISegmentedOption };
