import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import { showAlertForError } from 'soapbox/actions/alerts';
import { patchMe } from 'soapbox/actions/me';
import { FE_NAME, SETTINGS_UPDATE } from 'soapbox/actions/settings';
import Column from 'soapbox/features/ui/components/column';

import { Button, Form, FormActions, FormGroup, Textarea } from '../../components/ui';

const isJSONValid = text => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

const messages = defineMessages({
  heading: { id: 'column.settings_store', defaultMessage: 'Settings store' },
  hint: { id: 'developers.settings_store.hint', defaultMessage: 'It is possible to directly edit your user settings here. BE CAREFUL! Editing this section can break your account, and you will only be able to recover through the API.' },
});

const mapStateToProps = state => {
  return {
    settingsStore: state.get('settings'),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class SettingsStore extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    settingsStore: ImmutablePropTypes.map.isRequired,
  }

  state = {
    rawJSON: JSON.stringify(this.props.settingsStore, null, 2),
    jsonValid: true,
    isLoading: false,
  }

  componentDidUpdate(prevProps) {
    const { settingsStore } = this.props;

    if (settingsStore !== prevProps.settingsStore) {
      this.setState({
        rawJSON: JSON.stringify(settingsStore, null, 2),
        jsonValid: true,
      });
    }
  }

  handleEditJSON = ({ target }) => {
    const rawJSON = target.value;
    this.setState({ rawJSON, jsonValid: isJSONValid(rawJSON) });
  }

  handleSubmit = e => {
    const { dispatch } = this.props;
    const { rawJSON } = this.state;

    const settings = JSON.parse(rawJSON);

    this.setState({ isLoading: true });
    dispatch(patchMe({
      pleroma_settings_store: {
        [FE_NAME]: settings,
      },
    })).then(response => {
      dispatch({ type: SETTINGS_UPDATE, settings });
      this.setState({ isLoading: false });
    }).catch(error => {
      dispatch(showAlertForError(error));
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { intl } = this.props;
    const { rawJSON, jsonValid, isLoading } = this.state;

    return (
      <Column label={intl.formatMessage(messages.heading)} backHref='/developers'>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup
            hintText={intl.formatMessage(messages.hint)}
            errors={jsonValid ? [] : ['is invalid']}
          >
            <Textarea
              value={rawJSON}
              onChange={this.handleEditJSON}
              disabled={isLoading}
              rows={12}
              isCodeEditor
            />
          </FormGroup>

          <FormActions>
            <Button theme='primary' type='submit' disabled={!jsonValid || isLoading}>
              <FormattedMessage id='soapbox_config.save' defaultMessage='Save' />
            </Button>
          </FormActions>
        </Form>
      </Column>
    );
  }

}
