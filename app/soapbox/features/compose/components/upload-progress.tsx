import React from 'react';
import { FormattedMessage } from 'react-intl';
import spring from 'react-motion/lib/spring';

import Icon from 'soapbox/components/icon';
import { useAppSelector } from 'soapbox/hooks';

import Motion from '../../ui/util/optional_motion';

const UploadProgress = () => {
  const active = useAppSelector((state) => state.compose.get('is_uploading'));
  const progress = useAppSelector((state) => state.compose.get('progress'));

  if (!active) {
    return null;
  }

  return (
    <div className='upload-progress'>
      <div className='upload-progress__icon'>
        <Icon id='upload' />
      </div>

      <div className='upload-progress__message'>
        <FormattedMessage id='upload_progress.label' defaultMessage='Uploading…' />

        <div className='upload-progress__backdrop'>
          <Motion defaultStyle={{ width: 0 }} style={{ width: spring(progress) }}>
            {({ width }) =>
              <div className='upload-progress__tracker' style={{ width: `${width}%` }} />
            }
          </Motion>
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
