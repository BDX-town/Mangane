import React from 'react';

import Button from '../button/button';
import Stack from '../stack/stack';

interface IStreamfield {
  values: any[],
  onAddItem?: () => void,
  onChange: (values: any[]) => void,
  component: React.ComponentType<{ onChange: (value: any) => void, value: any }>,
  maxItems?: number,
}

/** List of inputs that can be added or removed. */
const Streamfield: React.FC<IStreamfield> = ({
  values,
  onAddItem,
  onChange,
  component: Component,
  maxItems = Infinity,
}) => {

  const handleChange = (i: number) => {
    return (value: any) => {
      const newData = [...values];
      newData[i] = value;
      onChange(newData);
    };
  };

  return (
    <Stack space={4}>

      <Stack>
        {values.map((value, i) => {
          return (
            <Component key={i} onChange={handleChange(i)} value={value} />
          );
        })}
      </Stack>

      {onAddItem && (
        <Button
          icon={require('@tabler/icons/icons/plus.svg')}
          onClick={onAddItem}
          disabled={values.length >= maxItems}
          theme='ghost'
          block
        >
          Add
        </Button>
      )}
    </Stack>
  );
};

export default Streamfield;
