import React from 'react';

import Button from '../button/button';
import HStack from '../hstack/hstack';
import IconButton from '../icon-button/icon-button';
import Stack from '../stack/stack';
import Text from '../text/text';

interface IStreamfield {
  /** Array of values for the streamfield. */
  values: any[],
  /** Input label message. */
  labelText?: React.ReactNode,
  /** Input hint message. */
  hintText?: React.ReactNode,
  /** Callback to add an item. */
  onAddItem?: () => void,
  /** Callback to remove an item by index. */
  onRemoveItem?: (i: number) => void,
  /** Callback when values are changed. */
  onChange: (values: any[]) => void,
  /** Input to render for each value. */
  component: React.ComponentType<{ onChange: (value: any) => void, value: any }>,
  /** Maximum number of allowed inputs. */
  maxItems?: number,
}

/** List of inputs that can be added or removed. */
const Streamfield: React.FC<IStreamfield> = ({
  values,
  labelText,
  hintText,
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
        {labelText && <Text size='sm' weight='medium'>{labelText}</Text>}
        {hintText && <Text size='xs' theme='muted'>{hintText}</Text>}
      </Stack>

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
