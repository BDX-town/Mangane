import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';

const messages = defineMessages({
  collapse: { id: 'accordion.collapse', defaultMessage: 'Collapse' },
  expand: { id: 'accordion.expand', defaultMessage: 'Expand' },
});

export default @injectIntl class Accordion extends React.PureComponent {

  static propTypes = {
    headline: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    intl: PropTypes.object.isRequired,
  };

  state = {
    expanded: false,
  }

  handleToggleAccordion = (e) => {
    this.setState({ expanded: !this.state.expanded });
    e.preventDefault();
  }

  render() {
    const { headline, content, intl } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classNames('accordion', { 'accordion--expanded' : expanded })}>
        <button
          type='button'
          className='accordion__title'
          onClick={this.handleToggleAccordion}
          title={intl.formatMessage(expanded ? messages.collapse : messages.expand)}
        >
          {headline}
        </button>
        <div className='accordion__content'>
          {content}
        </div>
      </div>
    );
  }

}
