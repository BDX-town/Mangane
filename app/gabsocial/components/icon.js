import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Icon extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    fixedWidth: PropTypes.bool,
  };

  render () {
    const { id, className, fixedWidth, ...other } = this.props;
    // Use the font awesome retweet icon, but change its alt
    // tag. There is a common adblocker rule which hides elements with
    // alt='retweet' unless the domain is twitter.com. This should
    // change what screenreaders call it as well.
    var alt_id = (id === 'retweet') ? 'repost' : id;
    return (
      <i role='img' alt={alt_id} className={classNames('fa', `fa-${id}`, className, { 'fa-fw': fixedWidth })} {...other} />
    );
  }

}
