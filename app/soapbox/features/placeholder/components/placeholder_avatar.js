import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Avatar extends React.PureComponent {

  static propTypes = {
    size: PropTypes.number,
    style: PropTypes.object,
    inline: PropTypes.bool,
  };

  static defaultProps = {
    inline: false,
  };

  render() {
    const { size, inline } = this.props;

    // : TODO : remove inline and change all avatars to be sized using css
    const style = !size ? {} : {
      width: `${size}px`,
      height: `${size}px`,
    };

    return (
      <div
        className={classNames('account__avatar', { 'account__avatar-inline': inline })}
        style={style}
        alt=''
      />
    );
  }

}
