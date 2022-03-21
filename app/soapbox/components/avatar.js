import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import StillImage from 'soapbox/components/still_image';

export default class Avatar extends React.PureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    size: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
  };

  render() {
    const { account, size, className } = this.props;
    if (!account) return null;

    // : TODO : remove inline and change all avatars to be sized using css
    const style = !size ? {} : {
      width: `${size}px`,
      height: `${size}px`,
    };

    return (
      <StillImage
        className={classNames('rounded-full', {
          [className]: typeof className !== 'undefined',
        })}
        style={style}
        src={account.get('avatar')}
        alt=''
      />
    );
  }

}
