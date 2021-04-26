import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';

const messages = defineMessages({
  collapse: { id: 'accordion.collapse', defaultMessage: 'Collapse' },
  expand: { id: 'accordion.expand', defaultMessage: 'Expand' },
});

export default @injectIntl class Accordion extends React.PureComponent {

  static propTypes = {
    headline: PropTypes.node.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
    menu: PropTypes.array,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    expanded: false,
    onToggle: () => {},
  }

  handleToggle = (e) => {
    this.props.onToggle(!this.props.expanded);
    e.preventDefault();
  }

  render() {
    const { headline, children, menu, expanded, intl } = this.props;

    return (
      <div className={classNames('accordion', { 'accordion--expanded' : expanded })}>
        {menu && (
          <div className='accordion__menu'>
            <DropdownMenu items={menu} icon='ellipsis-v' size={18} direction='right' />
          </div>
        )}
        <button
          type='button'
          className='accordion__title'
          onClick={this.handleToggle}
          title={intl.formatMessage(expanded ? messages.collapse : messages.expand)}
        >
          {headline}
        </button>
        <div className='accordion__content'>
          {children}
        </div>
      </div>
    );
  }

}
