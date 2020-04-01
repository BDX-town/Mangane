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
import { me } from '../initial_state';
import ErrorBoundary from '../components/error_boundary';
import { fetchSoapboxConfig } from 'gabsocial/actions/soapbox';

const { localeData, messages } = getLocale();
addLocaleData(localeData);

export const store = configureStore();
const hydrateAction = hydrateStore(initialState);

store.dispatch(hydrateAction);
store.dispatch(fetchCustomEmojis());
store.dispatch(fetchSoapboxConfig());

const mapStateToProps = (state) => {
  const account = state.getIn(['accounts', me]);
  const showIntroduction = account ? state.getIn(['settings', 'introductionVersion'], 0) < INTRODUCTION_VERSION : false;

  return {
    showIntroduction,
  }
}

@connect(mapStateToProps)
class GabSocialMount extends React.PureComponent {

  static propTypes = {
    showIntroduction: PropTypes.bool,
  };

  render () {
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

  componentDidMount() {
    this.disconnect = store.dispatch(connectUserStream());
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

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
