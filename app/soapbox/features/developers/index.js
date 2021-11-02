import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.developers', defaultMessage: 'Developers' },
});

export default @injectIntl
class Developers extends React.Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl } = this.props;

    return (
      <Column heading={intl.formatMessage(messages.heading)}>
        <div style={{ padding: '20px 10px', textAlign: 'center' }}>
          WIP: Developers page
        </div>
      </Column>
    );
  }

}
