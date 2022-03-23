import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

export default @withRouter
class Permalink extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    children: PropTypes.node,
    onInterceptClick: PropTypes.func,
    history: PropTypes.object,
    title: PropTypes.string,
    dangerouslySetInnerHTML: PropTypes.object,
  };

  handleClick = e => {
    if (this.props.onInterceptClick && this.props.onInterceptClick()) {
      e.preventDefault();
      return;
    }

    if (this.props.history && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.props.history.push(this.props.to);
    }
  }

  render() {
    const { href, children, className, title, dangerouslySetInnerHTML } = this.props;

    return (
      <a target='_blank' href={href} onClick={this.handleClick} dangerouslySetInnerHTML={dangerouslySetInnerHTML} title={title} className={`permalink${className ? ' ' + className : ''}`}>
        {children}
      </a>
    );
  }

}
