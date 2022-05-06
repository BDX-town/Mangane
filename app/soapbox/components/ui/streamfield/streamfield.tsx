import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import Button from '../button/button';
import HStack from '../hstack/hstack';
import IconButton from '../icon-button/icon-button';
import Stack from '../stack/stack';
import Text from '../text/text';

const messages = defineMessages({
  add: { id: 'streamfield.add', defaultMessage: 'Add' },
  remove: { id: 'streamfield.remove', defaultMessage: 'Remove' },
});

/** Type of the inner Streamfield input component. */
export type StreamfieldComponent<T> = React.ComponentType<{
  value: T,
  onChange: (value: T) => void,
}>;

interface IStreamfield {
  /** Array of values for the streamfield. */
  values: any[],
  /** Input label message. */
  label?: React.ReactNode,
  /** Input hint message. */
  hint?: React.ReactNode,
  /** Callback to add an item. */
  onAddItem?: () => void,
  /** Callback to remove an item by index. */
  onRemoveItem?: (i: number) => void,
  /** Callback when values are changed. */
  onChange: (values: any[]) => void,
  /** Input to render for each value. */
  component: StreamfieldComponent<any>,
  /** Maximum number of allowed inputs. */
  maxItems?: number,
}

/** List of inputs that can be added or removed. */
const Streamfield: React.FC<IStreamfield> = ({
  values,
  label,
  hint,
  onAddItem,
  onRemoveItem,
  onChange,
  component: Component,
  maxItems = Infinity,
}) => {
  const intl = useIntl();

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
        {label && <Text size='sm' weight='medium'>{label}</Text>}
        {hint && <Text size='xs' theme='muted'>{hint}</Text>}
      </Stack>

      {(values.length > 0) && (
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
                  title={intl.formatMessage(messages.remove)}
                />
              )}
            </HStack>
          ))}
        </Stack>
      )}

      {onAddItem && (
        <Button
          icon={require('@tabler/icons/icons/plus.svg')}
          onClick={onAddItem}
          disabled={values.length >= maxItems}
          theme='ghost'
          block
        >
          {intl.formatMessage(messages.add)}
        </Button>
      )}
    </Stack>
  );
};

export default Streamfield;
