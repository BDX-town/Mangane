import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { SimpleForm } from 'soapbox/features/forms';

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
      <SimpleForm>
        <h2 className='export-title'>{intl.formatMessage(messages.input_label)}</h2>
        <div>
          <p className='export-hint hint'>{intl.formatMessage(messages.input_hint)}</p>
          <button name='button' type='button' className='button button-primary' onClick={this.handleClick}>
            {intl.formatMessage(messages.submit)}
          </button>
        </div>
      </SimpleForm>
    );
  }

}
