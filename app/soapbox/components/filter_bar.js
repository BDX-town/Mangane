import classNames from 'classnames';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

export default @withRouter
class FilterBar extends React.PureComponent {

  static propTypes = {
    items: PropTypes.array.isRequired,
    active: PropTypes.string,
    className: PropTypes.string,
    history: PropTypes.object,
  };

  state = {
    mounted: false,
  };

  componentDidMount() {
    this.node.addEventListener('keydown', this.handleKeyDown, false);
    window.addEventListener('resize', this.handleResize, { passive: true });

    const { left, width } = this.getActiveTabIndicationSize();
    this.setState({ mounted: true, left, width });
  }

  componentWillUnmount() {
    this.node.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('resize', this.handleResize, false);
  }

  handleResize = debounce(() => {
    this.setState(this.getActiveTabIndicationSize());
  }, 300, {
    trailing: true,
  });

  componentDidUpdate(prevProps) {
    if (this.props.active !== prevProps.active) {
      this.setState(this.getActiveTabIndicationSize());
    }
  }

  setRef = c => {
    this.node = c;
  }

  setFocusRef = c => {
    this.focusedItem = c;
  }

  handleKeyDown = e => {
    const items = Array.from(this.node.getElementsByTagName('a'));
    const index = items.indexOf(document.activeElement);
    let element = null;

    switch (e.key) {
      case 'ArrowRight':
        element = items[index + 1] || items[0];
        break;
      case 'ArrowLeft':
        element = items[index - 1] || items[items.length - 1];
        break;
    }

    if (element) {
      element.focus();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleItemKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.handleClick(e);
    }
  }

  handleClick = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'));
    const { action, to } = this.props.items[i];

    if (typeof action === 'function') {
      e.preventDefault();
      action(e);
    } else if (to) {
      e.preventDefault();
      this.props.history.push(to);
    }
  }

  getActiveTabIndicationSize() {
    const { active, items } = this.props;

    if (!active || !this.node) return { width: null };

    const index = items.findIndex(({ name }) => name === active);
    const elements = Array.from(this.node.getElementsByTagName('a'));
    const element = elements[index];

    if (!element) return { width: null };

    const left = element.offsetLeft;
    const { width } = element.getBoundingClientRect();

    return { left, width };
  }

  renderActiveTabIndicator() {
    const { left, width } = this.state;

    return (
      <div className='filter-bar__active' style={{ left, width }} />
    );
  }

  renderItem(option, i) {
    if (option === null) {
      return <li key={`sep-${i}`} className='dropdown-menu__separator' />;
    }

    const { name, text, href, to, title } = option;

    return (
      <a
        key={name}
        href={href || to || '#'}
        role='button'
        tabIndex='0'
        ref={i === 0 ? this.setFocusRef : null}
        onClick={this.handleClick}
        onKeyPress={this.handleItemKeyPress}
        data-index={i}
        title={title}
      >
        {text}
      </a>
    );
  }

  render() {
    const { className, items } = this.props;
    const { mounted } = this.state;

    return (
      <div className={classNames('filter-bar', className)} ref={this.setRef}>
        {mounted && this.renderActiveTabIndicator()}
        {items.map((option, i) => this.renderItem(option, i))}
      </div>
    );
  }

}
