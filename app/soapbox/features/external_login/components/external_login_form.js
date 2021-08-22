import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { SimpleForm, FieldsGroup, TextInput } from 'soapbox/features/forms';
import { createAppAndRedirect, loginWithCode } from 'soapbox/actions/external_auth';
import LoadingIndicator from 'soapbox/components/loading_indicator';

const messages = defineMessages({
  instanceLabel: { id: 'login.fields.instance_label', defaultMessage: 'Instance' },
  instancePlaceholder: { id: 'login.fields.instance_placeholder', defaultMessage: 'example.com' },
});

export default @connect()
@injectIntl
class ExternalLoginForm extends ImmutablePureComponent {

  state = {
    host: '',
    isLoading: false,
  }

  handleHostChange = ({ target }) => {
    this.setState({ host: target.value });
  }

  handleSubmit = e => {
    const { dispatch } = this.props;
    const { host } = this.state;

    this.setState({ isLoading: true });

    dispatch(createAppAndRedirect(host))
      .then(() => this.setState({ isLoading: false }))
      .catch(() => this.setState({ isLoading: false }));
  }

  componentDidMount() {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      this.setState({ code });
      this.props.dispatch(loginWithCode(code));
    }
  }

  render() {
    const { intl } = this.props;
    const { isLoading, code } = this.state;

    if (code) {
      return <LoadingIndicator />;
    }

    return (
      <SimpleForm onSubmit={this.handleSubmit}>
        <fieldset disabled={isLoading}>
          <FieldsGroup>
            <TextInput
              label={intl.formatMessage(messages.instanceLabel)}
              placeholder={intl.formatMessage(messages.instancePlaceholder)}
              name='host'
              value={this.state.host}
              onChange={this.handleHostChange}
              autoComplete='off'
              required
            />
          </FieldsGroup>
        </fieldset>
        <div className='actions'>
          <button name='button' type='submit' className='btn button button-primary'>
            <FormattedMessage id='login.log_in' defaultMessage='Log in' />
          </button>
        </div>
      </SimpleForm>
    );
  }

}
