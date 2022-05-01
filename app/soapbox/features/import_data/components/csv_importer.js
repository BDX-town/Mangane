import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Button, Form, FormActions, Text } from 'soapbox/components/ui';

export default @connect()
@injectIntl
class CSVImporter extends ImmutablePureComponent {

  static propTypes = {
    action: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    file: null,
    isLoading: false,
  }

  handleSubmit = (event) => {
    const { dispatch, action, intl } = this.props;

    const params = new FormData();
    params.append('list', this.state.file);

    this.setState({ isLoading: true });
    dispatch(action(intl, params)).then(() => {
      this.setState({ isLoading: false });
    }).catch((error) => {
      this.setState({ isLoading: false });
    });

    event.preventDefault();
  }

  handleFileChange = e => {
    const [file] = e.target.files || [];
    this.setState({ file });
  }

  render() {
    const { intl, messages } = this.props;

    return (
      <Form onSubmit={this.handleSubmit} disabled={this.state.isLoading}>
        <Text size='xl' weight='bold' tag='label'>{intl.formatMessage(messages.input_label)}</Text>
        <div>
          <input
            className='text-black dark:text-white'
            type='file'
            accept={['.csv', 'text/csv']}
            onChange={this.handleFileChange}
            required
          />
          <Text theme='muted'>{intl.formatMessage(messages.input_hint)}</Text>
        </div>
        <FormActions>
          <Button type='submit' theme='primary' disabled={this.state.isLoading}>
            {intl.formatMessage(messages.submit)}
          </Button>
        </FormActions>
      </Form>
    );
  }

}
