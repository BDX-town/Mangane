import React from 'react';

interface ITextIconButton {
  label: string,
  title: string,
  active: boolean,
  onClick: () => void,
  ariaControls: string,
  unavailable: boolean,
}

const TextIconButton: React.FC<ITextIconButton> = ({
  label,
  title,
  active,
  ariaControls,
  unavailable,
  onClick,
}) => {
  const handleClick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    onClick();
  };

  if (unavailable) {
    return null;
  }

  return (
    <button title={title} aria-label={title} className={`text-icon-button ${active ? 'active' : ''}`} aria-expanded={active} onClick={handleClick} aria-controls={ariaControls}>
      {label}
    </button>
  );
};

export default TextIconButton;
