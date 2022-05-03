import React from 'react';

import Button from '../button/button';
import HStack from '../hstack/hstack';
import IconButton from '../icon-button/icon-button';
import Stack from '../stack/stack';

interface IStreamfield {
  values: any[],
  onAddItem?: () => void,
  onRemoveItem?: (i: number) => void,
  onChange: (values: any[]) => void,
  component: React.ComponentType<{ onChange: (value: any) => void, value: any }>,
  maxItems?: number,
}

/** List of inputs that can be added or removed. */
const Streamfield: React.FC<IStreamfield> = ({
  values,
  onAddItem,
  onRemoveItem,
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
        {values.map((value, i) => (
          <HStack space={2} alignItems='center'>
            <Component key={i} onChange={handleChange(i)} value={value} />
            {onRemoveItem && (
              <IconButton
                iconClassName='w-4 h-4'
                className='bg-transparent text-gray-400 hover:text-gray-600'
                src={require('@tabler/icons/icons/x.svg')}
                onClick={() => onRemoveItem(i)}
              />
            )}
          </HStack>
        ))}
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
