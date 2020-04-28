'use strict';

import React from 'react';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';
import SoapboxPropTypes from 'gabsocial/utils/soapbox_prop_types';
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
import PublicLayout from 'gabsocial/features/public_layout';
import { getSettings } from 'gabsocial/actions/settings';

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
  const settings = getSettings(state);

  return {
    showIntroduction,
    me,
    theme: settings.get('theme'),
    reduceMotion: settings.get('reduceMotion'),
    systemFont: settings.get('systemFont'),
    dyslexicFont: settings.get('dyslexicFont'),
    demetricator: settings.get('demetricator'),
    locale: settings.get('locale'),
  };
};

@connect(mapStateToProps)
class GabSocialMount extends React.PureComponent {

  static propTypes = {
    showIntroduction: PropTypes.bool,
    me: SoapboxPropTypes.me,
    theme: PropTypes.string,
    reduceMotion: PropTypes.bool,
    systemFont: PropTypes.bool,
    dyslexicFont: PropTypes.bool,
    demetricator: PropTypes.bool,
    locale: PropTypes.string.isRequired,
  };

  render() {
    const { me, theme, reduceMotion, systemFont, dyslexicFont, demetricator, locale } = this.props;
    if (me === null) return null;

    const { localeData, messages } = getLocale();
    addLocaleData(localeData);

    // Disabling introduction for launch
    // const { showIntroduction } = this.props;
    //
    // if (showIntroduction) {
    //   return <Introduction />;
    // }

    const bodyClass = classNames('app-body', {
      [`theme-${theme}`]: theme,
      'system-font': systemFont,
      'no-reduce-motion': !reduceMotion,
      'dyslexic': dyslexicFont,
      'demetricator': demetricator,
    });

    return (
      <IntlProvider locale={locale} messages={messages}>
        <>
          <Helmet>
            <body className={bodyClass} />
            <script src={`/packs/js/locale_${locale}.chunk.js`} />
            {theme && <link rel='stylesheet' href={`/packs/css/${theme}.chunk.css`} />}
          </Helmet>
          <BrowserRouter>
            <ScrollContext>
              <Switch>
                {!me && <Route exact path='/' component={PublicLayout} />}
                <Route exact path='/about/:slug?' component={PublicLayout} />
                <Route path='/' component={UI} />
              </Switch>
            </ScrollContext>
          </BrowserRouter>
        </>
      </IntlProvider>
    );
  }

}

export default class GabSocial extends React.PureComponent {

  render() {
    return (
      <Provider store={store}>
        <ErrorBoundary>
          <GabSocialMount />
        </ErrorBoundary>
      </Provider>
    );
  }

}
