import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Button, Form, FormActions, Text } from 'soapbox/components/ui';

export default @connect()
@injectIntl
class CSVExporter extends ImmutablePureComponent {

  static propTypes = {
    action: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isLoading: false,
  }

  handleClick = (event) => {
    const { dispatch, action, intl } = this.props;

    this.setState({ isLoading: true });
    dispatch(action(intl)).then(() => {
      this.setState({ isLoading: false });
    }).catch((error) => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { intl, messages } = this.props;

    return (
      <>
        <Form>
          <Text size='xl' weight='bold'>{intl.formatMessage(messages.input_label)}</Text>
          <Text theme='muted'>{intl.formatMessage(messages.input_hint)}</Text>

          <FormActions>
            <Button theme='primary' onClick={this.handleClick}>
              {intl.formatMessage(messages.submit)}
            </Button>
          </FormActions>
        </Form>
      </>
    );
  }

}
