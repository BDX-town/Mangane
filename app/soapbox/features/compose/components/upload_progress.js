import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import spring from 'react-motion/lib/spring';

import Icon from 'soapbox/components/icon';

import Motion from '../../ui/util/optional_motion';

export default class UploadProgress extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    progress: PropTypes.number,
  };

  render() {
    const { active, progress } = this.props;

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
  }

}
