import React, { useState, useRef } from 'react';
// @ts-ignore: TODO: upgrade react-overlays. v3.1 and above have TS definitions
import Overlay from 'react-overlays/lib/Overlay';

import { isMobile } from 'soapbox/is_mobile';

import ColorPicker from './color-picker';

import type { ColorChangeHandler } from 'react-color';

interface IColorWithPicker {
  buttonId: string,
  label: React.ReactNode,
  value: string,
  onChange: ColorChangeHandler,
}

const ColorWithPicker: React.FC<IColorWithPicker> = ({ buttonId, label, value, onChange }) => {
  const node = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [placement, setPlacement] = useState<string | null>(null);

  const hidePicker = () => {
    setActive(false);
  };

  const showPicker = () => {
    setActive(true);
    setPlacement(isMobile(window.innerWidth) ? 'bottom' : 'right');
  };

  const onToggle: React.MouseEventHandler = () => {
    if (active) {
      hidePicker();
    } else {
      showPicker();
    }
  };

  return (
    <div className='label_input__color'>
      <label>{label}</label>

      <div
        ref={node}
        id={buttonId}
        className='color-swatch'
        role='presentation'
        style={{ background: value }}
        title={value}
        onClick={onToggle}
      />

      <Overlay show={active} placement={placement} target={node.current}>
        <ColorPicker value={value} onChange={onChange} onClose={hidePicker} />
      </Overlay>
    </div>
  );
};

export default ColorWithPicker;
