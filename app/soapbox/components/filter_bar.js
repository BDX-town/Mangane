import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default class FilterBar extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    items: PropTypes.array.isRequired,
    active: PropTypes.string,
    className: PropTypes.string,
  };

  state = {
    mounted: false,
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
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

    switch(e.key) {
    case 'ArrowRight':
      element = items[index+1] || items[0];
      break;
    case 'ArrowLeft':
      element = items[index-1] || items[items.length-1];
      break;
    case 'Tab':
      if (e.shiftKey) {
        element = items[index-1] || items[items.length-1];
      } else {
        element = items[index+1] || items[0];
      }
      break;
    case 'Home':
      element = items[0];
      break;
    case 'End':
      element = items[items.length-1];
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
      this.context.router.history.push(to);
    }
  }

  renderActiveTabIndicator() {
    const { active, items } = this.props;

    if (!active || !this.node) return null;

    const index = items.findIndex(({ name }) => name === active);
    const elements = Array.from(this.node.getElementsByTagName('a'));
    const element = elements[index];

    if (!element) return null;

    const offsetLeft = element.offsetLeft;
    const { width } = element.getBoundingClientRect();

    return (
      <div className='filter-bar__active' style={{ left: offsetLeft, width }} />
    );
  }

  renderItem(option, i) {
    if (option === null) {
      return <li key={`sep-${i}`} className='dropdown-menu__separator' />;
    }

    const { text, href, to, title } = option;

    return (
      <a
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