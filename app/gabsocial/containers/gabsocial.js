'use strict';

import React from 'react';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';
import configureStore from '../store/configureStore';
import { INTRODUCTION_VERSION } from '../actions/onboarding';
import { BrowserRouter, Route } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import UI from '../features/ui';
import Introduction from '../features/introduction';
import { fetchCustomEmojis } from '../actions/custom_emojis';
import { hydrateStore } from '../actions/store';
import { connectUserStream } from '../actions/streaming';
import { IntlProvider, addLocaleData } from 'react-intl';
import { getLocale } from '../locales';
import initialState from '../initial_state';
import ErrorBoundary from '../components/error_boundary';
import { fetchInstance } from 'gabsocial/actions/instance';
import { fetchSoapboxConfig } from 'gabsocial/actions/soapbox';
import { fetchMe } from 'gabsocial/actions/me';

const { localeData, messages } = getLocale();
addLocaleData(localeData);

export const store = configureStore();
const hydrateAction = hydrateStore(initialState);

store.dispatch(hydrateAction);
store.dispatch(fetchMe());
store.dispatch(fetchInstance());
store.dispatch(fetchSoapboxConfig());
store.dispatch(fetchCustomEmojis());

const mapStateToProps = (state) => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);
  const showIntroduction = account ? state.getIn(['settings', 'introductionVersion'], 0) < INTRODUCTION_VERSION : false;

  return {
    showIntroduction,
    me,
    // accessToken: state.getIn(['auth', 'user', 'access_token']),
    accessToken: JSON.parse(localStorage.getItem('user')).access_token,
    streamingUrl: state.getIn(['instance', 'urls', 'streaming_api']),
  }
}

@connect(mapStateToProps)
class GabSocialMount extends React.PureComponent {

  static propTypes = {
    showIntroduction: PropTypes.bool,
  };

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate(prevProps) {
    const keys = ['accessToken', 'streamingUrl'];
    const credsSet = keys.every(p => this.props[p]);
    if (!this.disconnect && credsSet) {
      this.disconnect = store.dispatch(connectUserStream());
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  render () {
    const { me, streamingUrl } = this.props;
    if (me == null || !streamingUrl) return null;

    // Disabling introduction for launch
    // const { showIntroduction } = this.props;
    //
    // if (showIntroduction) {
    //   return <Introduction />;
    // }

    return (
      <BrowserRouter basename='/web'>
        <ScrollContext>
          <Route component={UI} />
        </ScrollContext>
      </BrowserRouter>
    );
  }

}

export default class GabSocial extends React.PureComponent {

  static propTypes = {
    locale: PropTypes.string.isRequired,
  };

  render () {
    const { locale } = this.props;

    return (
      <IntlProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <ErrorBoundary>
            <GabSocialMount />
          </ErrorBoundary>
        </Provider>
      </IntlProvider>
    );
  }

}
