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
    inline: PropTypes.bool,
  };

  static defaultProps = {
    inline: false,
  };

  render() {
    const { account, size, inline } = this.props;
    if (!account) return null;

    // : TODO : remove inline and change all avatars to be sized using css
    const style = !size ? {} : {
      width: `${size}px`,
      height: `${size}px`,
    };

    // Only render the image if src is provided
    if (account.get('avatar')) {
      return (
        <StillImage
          className={classNames('account__avatar', { 'account__avatar-inline': inline })}
          style={style}
          src={account.get('avatar')}
          alt=''
        />
      );
    } else {
      // Fall back on rendering an empty div
      return (
        <div className={classNames('account__avatar', { 'account__avatar-inline': inline })} style={style} />
      );
    }
  }

}
