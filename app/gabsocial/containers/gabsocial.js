'use strict';

import React from 'react';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'gabsocial/components/helmet';
import classNames from 'classnames';
import configureStore from '../store/configureStore';
import { INTRODUCTION_VERSION } from '../actions/onboarding';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import UI from '../features/ui';
// import Introduction from '../features/introduction';
import { fetchCustomEmojis } from '../actions/custom_emojis';
import { hydrateStore } from '../actions/store';
import { IntlProvider, addLocaleData } from 'react-intl';
import { getLocale } from '../locales';
import initialState from '../initial_state';
import ErrorBoundary from '../components/error_boundary';
import { fetchInstance } from 'gabsocial/actions/instance';
import { fetchSoapboxConfig } from 'gabsocial/actions/soapbox';
import { fetchMe } from 'gabsocial/actions/me';
import LandingPage from 'gabsocial/features/landing_page';

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
    theme: state.getIn(['settings', 'theme']),
    systemFont: state.getIn(['settings', 'systemFont']),
    dyslexicFont: state.getIn(['settings', 'dyslexicFont']),
    demetricator: state.getIn(['settings', 'demetricator']),
  };
};

@connect(mapStateToProps)
class GabSocialMount extends React.PureComponent {

  static propTypes = {
    showIntroduction: PropTypes.bool,
    me: PropTypes.string,
    theme: PropTypes.string,
    systemFont: PropTypes.bool,
    dyslexicFont: PropTypes.bool,
    demetricator: PropTypes.bool,
  };

  render() {
    const { me, theme, systemFont, dyslexicFont, demetricator } = this.props;
    if (me === null) return null;

    // Disabling introduction for launch
    // const { showIntroduction } = this.props;
    //
    // if (showIntroduction) {
    //   return <Introduction />;
    // }

    const bodyClass = classNames('app-body', {
      [`theme-${theme}`]: theme,
      'system-font': systemFont,
      'dyslexic': dyslexicFont,
      'demetricator': demetricator,
    });

    return (
      <>
        <Helmet>
          <body className={bodyClass} />
          {theme && <link rel='stylesheet' href={`/packs/css/${theme}.chunk.css`} />}
        </Helmet>
        <BrowserRouter basename='/web'>
          <ScrollContext>
            <Switch>
              {!me && <Route exact path='/' component={LandingPage} />}
              <Route path='/' component={UI} />
            </Switch>
          </ScrollContext>
        </BrowserRouter>
      </>
    );
  }

}

export default class GabSocial extends React.PureComponent {

  static propTypes = {
    locale: PropTypes.string.isRequired,
  };

  render() {
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
