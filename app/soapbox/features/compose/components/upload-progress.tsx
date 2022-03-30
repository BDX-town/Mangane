import React from 'react';
import { FormattedMessage } from 'react-intl';
import { spring } from 'react-motion';

import { HStack, Icon, Stack, Text } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import Motion from '../../ui/util/optional_motion';

const UploadProgress = () => {
  const active = useAppSelector((state) => state.compose.get('is_uploading'));
  const progress = useAppSelector((state) => state.compose.get('progress'));

  if (!active) {
    return null;
  }

  return (
    <HStack alignItems='center' space={2}>
      <Icon
        src={require('@tabler/icons/icons/cloud-upload.svg')}
        className='w-7 h-7 text-gray-500'
      />

      <Stack space={1}>
        <Text theme='muted'>
          <FormattedMessage id='upload_progress.label' defaultMessage='Uploading…' />
        </Text>

        <div className='w-full h-1.5 rounded-lg bg-gray-200 relative'>
          <Motion defaultStyle={{ width: 0 }} style={{ width: spring(progress) }}>
            {({ width }) =>
              (<div
                className='absolute left-0 top-0 h-1.5 bg-primary-600 rounded-lg'
                style={{ width: `${width}%` }}
              />)
            }
          </Motion>
        </div>
      </Stack>
    </HStack>
  );
};

export default UploadProgress;
