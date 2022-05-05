import React, { useState, useRef } from 'react';
// @ts-ignore: TODO: upgrade react-overlays. v3.1 and above have TS definitions
import Overlay from 'react-overlays/lib/Overlay';

import { isMobile } from 'soapbox/is_mobile';

import ColorPicker from './color-picker';

import type { ColorChangeHandler } from 'react-color';

interface IColorWithPicker {
  buttonId: string,
  value: string,
  onChange: ColorChangeHandler,
}

const ColorWithPicker: React.FC<IColorWithPicker> = ({ buttonId, value, onChange }) => {
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
    <div>
      <div
        ref={node}
        id={buttonId}
        className='w-8 h-8 rounded-md'
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
