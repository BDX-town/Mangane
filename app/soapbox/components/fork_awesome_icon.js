/**
 * ForkAwesomeIcon: renders a ForkAwesome icon.
 * Full list: https://forkaweso.me/Fork-Awesome/icons/
 * @module soapbox/components/fork_awesome_icon
 * @see soapbox/components/icon
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ForkAwesomeIcon extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    fixedWidth: PropTypes.bool,
  };

  render() {
    const { id, className, fixedWidth, ...other } = this.props;

    // Use the Fork Awesome retweet icon, but change its alt
    // tag. There is a common adblocker rule which hides elements with
    // alt='retweet' unless the domain is twitter.com. This should
    // change what screenreaders call it as well.
    const alt = (id === 'retweet') ? 'repost' : id;

    return (
      <i
        role='img'
        alt={alt}
        className={classNames('fa', `fa-${id}`, className, { 'fa-fw': fixedWidth })}
        {...other}
      />
    );
  }

}
