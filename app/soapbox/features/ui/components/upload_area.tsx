import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { spring } from 'react-motion';

import { Icon, Stack, Text } from 'soapbox/components/ui';

import Motion from '../../ui/util/optional_motion';

interface IUploadArea {
  /** Whether the upload area is active. */
  active: boolean,
  /** Callback when the upload area is closed. */
  onClose: () => void,
}

/** Component to display when a file is dragged over the UI. */
const UploadArea: React.FC<IUploadArea> = ({ active, onClose }) => {
  const handleKeyUp = (e: KeyboardEvent) => {
    const keyCode = e.keyCode;

    if (active) {
      switch (keyCode) {
        case 27:
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('keyup', handleKeyUp, false);

    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);

  return (
    <Motion
      defaultStyle={{ backgroundOpacity: 0, backgroundScale: 0.95 }}
      style={{ backgroundOpacity: spring(active ? 1 : 0, { stiffness: 150, damping: 15 }), backgroundScale: spring(active ? 1 : 0.95, { stiffness: 200, damping: 3 }) }}
    >
      {({ backgroundOpacity, backgroundScale }) => (
        <div
          className={classNames({
            'flex items-center justify-center bg-gray-700 bg-opacity-90 h-full w-full absolute left-0 top-0 z-1000 pointer-events-none': true,
            'visible': active,
            'invisible': !active,
          })}
          style={{ opacity: backgroundOpacity }}
        >
          <div className='w-80 h-40 flex relative p-2'>
            <div className='absolute inset-0' style={{ transform: `scale(${backgroundScale})` }} />

            <Stack space={3} justifyContent='center' alignItems='center'>
              <Icon
                src={require('@tabler/icons/icons/cloud-upload.svg')}
                className='w-12 h-12 text-white text-opacity-90'
              />

              <Text size='xl' theme='white'>
                <FormattedMessage id='upload_area.title' defaultMessage='Drag & drop to upload' />
              </Text>
            </Stack>
          </div>
        </div>
      )}
    </Motion>
  );
};

export default UploadArea;
