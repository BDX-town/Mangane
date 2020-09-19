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
import { importFollows } from 'soapbox/actions/import_follows';
import { uploadMedia } from 'soapbox/actions/media';

const messages = defineMessages({
  heading: { id: 'column.import_follows', defaultMessage: 'Import follows' },
});

const mapStateToProps = state => ({
  follows: state.get('follows'),
});

export default @connect(mapStateToProps)
@injectIntl
class ImportFollows extends ImmutablePureComponent {

  static propTypes = {
    follows: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isLoading: false,
    follows: this.props.follows,
  }

  setConfig = (value) => {
    this.setState({ follows: value });
  };

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    dispatch(importFollows(this.state.follows)).then(() => {
      this.setState({ isLoading: false });
    }).catch((error) => {
      this.setState({ isLoading: false });
    });
    this.setState({ isLoading: true });
    event.preventDefault();
  }

  handleChange = (getValue) => {
    return e => {
      this.setConfig(getValue(e));
    };
  };

  handleFileChange = path => {
    return e => {
      const data = new FormData();
      data.append('file', e.target.files[0]);
      this.props.dispatch(uploadMedia(data)).then(({ data }) => {
        this.handleChange(e => data.url)(e);
      }).catch(() => {});
    };
  };

  render() {
    const { intl } = this.props;

    return (
      <Column icon='cog' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <FieldsGroup>
              <div className='fields-row file-picker'>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooserCSV
                    label={<FormattedMessage id='import_follows.follows_label' defaultMessage='Follows' />}
                    name='follows'
                    hint={<FormattedMessage id='import_follows.hints.follows' defaultMessage='CSV file containing a list of followed accounts' />}
                    onChange={this.handleFileChange('follows')}
                  />
                </div>
              </div>
            </FieldsGroup>
          </fieldset>
          <div className='actions'>
            <button name='button' type='submit' className='btn button button-primary'>
              <FormattedMessage id='soapbox_config.save' defaultMessage='Save' />
            </button>
          </div>
        </SimpleForm>
      </Column>
    );
  }

}
