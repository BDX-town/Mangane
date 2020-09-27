import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import {
  SimpleForm,
  FieldsGroup,
  FileChooserCSV,
} from 'soapbox/features/forms';

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
    const { dispatch, action } = this.props;

    let params = new FormData();
    params.append('list', this.state.file);

    this.setState({ isLoading: true });
    dispatch(action(params)).then(() => {
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
      <SimpleForm onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.isLoading}>
          <FieldsGroup>
            <div className='fields-row file-picker'>
              <div className='fields-row__column fields-group fields-row__column-6'>
                <FileChooserCSV
                  label={intl.formatMessage(messages.input_label)}
                  hint={intl.formatMessage(messages.input_hint)}
                  onChange={this.handleFileChange}
                  required
                />
              </div>
            </div>
          </FieldsGroup>
        </fieldset>
        <div className='actions'>
          <button name='button' type='submit' className='btn button button-primary'>
            {intl.formatMessage(messages.submit)}
          </button>
        </div>
      </SimpleForm>
    );
  }

}
