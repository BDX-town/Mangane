import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames';
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

    return (
      <StillImage
        className={classNames('account__avatar', { 'account__avatar-inline': inline })}
        style={style}
        src={account.get('avatar')}
        alt=''
      />
    );
  }

}
