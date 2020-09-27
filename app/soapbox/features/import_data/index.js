import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/column';
import {
  SimpleForm,
  FieldsGroup,
  FileChooserCSV,
} from 'soapbox/features/forms';
import { importFollows } from 'soapbox/actions/import_data';

const messages = defineMessages({
  heading: { id: 'column.import_data', defaultMessage: 'Import data' },
});

export default @connect()
@injectIntl
class ImportData extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    followsCSV: null,
    isLoading: false,
  }

  handleSubmit = (event) => {
    const { dispatch } = this.props;

    let params = new FormData();
    params.append('list', this.state.followsCSV);

    this.setState({ isLoading: true });
    dispatch(importFollows(params)).then(() => {
      this.setState({ isLoading: false });
    }).catch((error) => {
      this.setState({ isLoading: false });
    });

    event.preventDefault();
  }

  handleFileChange = e => {
    const [followsCSV] = e.target.files || [];
    this.setState({ followsCSV });
  }

  render() {
    const { intl } = this.props;

    return (
      <Column icon='cloud-upload' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <FieldsGroup>
              <div className='fields-row file-picker'>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooserCSV
                    label={<FormattedMessage id='import_data.follows_label' defaultMessage='Follows' />}
                    name='follows'
                    hint={<FormattedMessage id='import_data.hints.follows' defaultMessage='CSV file containing a list of followed accounts' />}
                    onChange={this.handleFileChange}
                    required
                  />
                </div>
              </div>
            </FieldsGroup>
          </fieldset>
          <div className='actions'>
            <button name='button' type='submit' className='btn button button-primary'>
              <FormattedMessage id='import_data.actions.import' defaultMessage='Import' />
            </button>
          </div>
        </SimpleForm>
      </Column>
    );
  }

}
