import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import { createApp } from 'soapbox/actions/apps';
import { obtainOAuthToken } from 'soapbox/actions/oauth';
import Column from 'soapbox/features/ui/components/column';
import { getBaseURL } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

import { Button, Form, FormActions, FormGroup, Input, Stack, Text, Textarea } from '../../../components/ui';

const messages = defineMessages({
  heading: { id: 'column.app_create', defaultMessage: 'Create app' },
  namePlaceholder: { id: 'app_create.name_placeholder', defaultMessage: 'e.g. \'Soapbox\'' },
  scopesPlaceholder: { id: 'app_create.scopes_placeholder', defaultMessage: 'e.g. \'read write follow\'' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);

  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    account,
    defaultScopes: features.scopes,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class CreateApp extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    account: ImmutablePropTypes.record.isRequired,
    defaultScopes: PropTypes.string,
  }

  initialState = () => {
    return {
      params: ImmutableMap({
        client_name: '',
        redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
        scopes: '',
        website: '',
      }),
      app: null,
      token: null,
      isLoading: false,
    };
  }

  state = this.initialState()

  handleCreateApp = () => {
    const { dispatch, account } = this.props;
    const { params } = this.state;
    const baseURL = getBaseURL(account);

    return dispatch(createApp(params.toJS(), baseURL))
      .then(app => this.setState({ app }));
  }

  handleCreateToken = () => {
    const { dispatch, account } = this.props;
    const { app, params: appParams } = this.state;
    const baseURL = getBaseURL(account);

    const tokenParams = {
      client_id:     app.client_id,
      client_secret: app.client_secret,
      redirect_uri:  appParams.get('redirect_uri'),
      grant_type:    'client_credentials',
      scope:         appParams.get('scopes'),
    };

    return dispatch(obtainOAuthToken(tokenParams, baseURL))
      .then(token => this.setState({ token }));
  }

  handleSubmit = e => {
    this.setState({ isLoading: true });

    this.handleCreateApp()
      .then(this.handleCreateToken)
      .then(() => {
        this.scrollToTop();
        this.setState({ isLoading: false });
      }).catch(error => {
        console.error(error);
        this.setState({ isLoading: false });
      });
  }

  setParam = (key, value) => {
    const { params } = this.state;
    const newParams = params.set(key, value);

    this.setState({ params: newParams });
  }

  handleParamChange = key => {
    return e => {
      this.setParam(key, e.target.value);
    };
  }

  resetState = () => {
    this.setState(this.initialState());
  }

  handleReset = e => {
    this.resetState();
    this.scrollToTop();
  }

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderResults = () => {
    const { intl } = this.props;
    const { app, token } = this.state;

    return (
      <Column label={intl.formatMessage(messages.heading)} backHref='/developers'>
        <Form>
          <Stack>
            <Text size='lg' weight='medium'>
              <FormattedMessage id='app_create.results.explanation_title' defaultMessage='App created successfully' />
            </Text>
            <Text theme='muted'>
              <FormattedMessage
                id='app_create.results.explanation_text'
                defaultMessage='You created a new app and token! Please copy the credentials somewhere; you will not see them again after navigating away from this page.'
              />
            </Text>
          </Stack>

          <FormGroup labelText={<FormattedMessage id='app_create.results.app_label' defaultMessage='App' />}>
            <Textarea
              value={JSON.stringify(app, null, 2)}
              rows={10}
              readOnly
              isCodeEditor
            />
          </FormGroup>

          <FormGroup labelText={<FormattedMessage id='app_create.results.token_label' defaultMessage='OAuth token' />}>
            <Textarea
              value={JSON.stringify(token, null, 2)}
              rows={10}
              readOnly
              isCodeEditor
            />
          </FormGroup>

          <FormActions>
            <Button theme='primary' type='button' onClick={this.handleReset}>
              <FormattedMessage id='app_create.restart' defaultMessage='Create another' />
            </Button>
          </FormActions>
        </Form>
      </Column>
    );
  }

  render() {
    const { intl } = this.props;
    const { params, app, token, isLoading } = this.state;

    if (app && token) {
      return this.renderResults();
    }

    return (
      <Column label={intl.formatMessage(messages.heading)} backHref='/developers'>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup labelText={<FormattedMessage id='app_create.name_label' defaultMessage='App name' />}>
            <Input
              placeholder={intl.formatMessage(messages.namePlaceholder)}
              onChange={this.handleParamChange('client_name')}
              value={params.get('client_name')}
              required
            />
          </FormGroup>

          <FormGroup labelText={<FormattedMessage id='app_create.website_label' defaultMessage='Website' />}>
            <Input
              placeholder='https://soapbox.pub'
              onChange={this.handleParamChange('website')}
              value={params.get('website')}
            />
          </FormGroup>

          <FormGroup labelText={<FormattedMessage id='app_create.redirect_uri_label' defaultMessage='Redirect URIs' />}>
            <Input
              placeholder='https://example.com'
              onChange={this.handleParamChange('redirect_uris')}
              value={params.get('redirect_uris')}
              required
            />
          </FormGroup>

          <FormGroup labelText={<FormattedMessage id='app_create.scopes_label' defaultMessage='Scopes' />}>
            <Input
              placeholder={intl.formatMessage(messages.scopesPlaceholder)}
              onChange={this.handleParamChange('scopes')}
              value={params.get('scopes')}
              required
            />
          </FormGroup>

          <FormActions>
            <Button theme='primary' type='submit' disabled={isLoading}>
              <FormattedMessage id='app_create.submit' defaultMessage='Create app' />
            </Button>
          </FormActions>
        </Form>
      </Column>
    );
  }

}
