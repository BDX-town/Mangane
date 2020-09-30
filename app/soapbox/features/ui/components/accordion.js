import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import IconButton from 'soapbox/components/icon_button';
import classNames from 'classnames';

const messages = defineMessages({
  collapse: { id: 'accordion.collapse', defaultMessage: 'Collapse accordion' },
  expand: { id: 'accordion.expand', defaultMessage: 'Expand accordion' },
});


export default @injectIntl class Accordion extends React.PureComponent {

  static propTypes = {
    headline: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    intl: PropTypes.object.isRequired,
  };

  state = {
    expanded: false,
  }

  handleToggleAccordion = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { headline, content, intl } = this.props;
    const { expanded } = this.state;

    return (
      <div className='accordion'>
        {headline && <div className='accordion__title'>{headline}
          <IconButton
            className='accordion__toggle' size={20}
            title={expanded ? intl.formatMessage(messages.collapse) : intl.formatMessage(messages.expand)}
            icon={expanded ? 'angle-down' : 'angle-up'}
            onClick={this.handleToggleAccordion}
          />
        </div>}
        <div className={classNames(
          'accordion_content',
          { 'expanded' : expanded },
          { 'closed' : !expanded })}
        >
          {content}
        </div>
      </div>
    );
  }

}
