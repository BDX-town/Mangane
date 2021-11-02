import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Column from 'soapbox/features/ui/components/column';
import { SimpleForm, TextInput } from 'soapbox/features/forms';

const messages = defineMessages({
  heading: { id: 'column.app_create', defaultMessage: 'Create app' },
  namePlaceholder: { id: 'app_create.name_placeholder', defaultMessage: 'e.g. \'Soapbox\'' },
});

export default @injectIntl
class CreateApp extends React.Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl } = this.props;

    return (
      <Column heading={intl.formatMessage(messages.heading)}>
        <SimpleForm>
          TODO: This page is incomplete

          <TextInput
            label={<FormattedMessage id='app_create.name_label' defaultMessage='App name' />}
            placeholder={intl.formatMessage(messages.namePlaceholder)}
            required
          />
          <TextInput
            label={<FormattedMessage id='app_create.website_label' defaultMessage='Website' />}
            placeholder='https://soapbox.pub'
          />
        </SimpleForm>
      </Column>
    );
  }

}
