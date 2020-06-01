'use strict';

import React from 'react';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';
import Helmet from 'soapbox/components/helmet';
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
import { fetchInstance } from 'soapbox/actions/instance';
import { fetchSoapboxConfig } from 'soapbox/actions/soapbox';
import { fetchMe } from 'soapbox/actions/me';
import PublicLayout from 'soapbox/features/public_layout';
import { getSettings } from 'soapbox/actions/settings';
import { themeDataToCss } from 'soapbox/utils/theme';
import { generateTheme } from 'soapbox/actions/theme';

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
    themeCss: themeDataToCss(state.get('theme')),
  };
};

@connect(mapStateToProps)
class SoapboxMount extends React.PureComponent {

  static propTypes = {
    showIntroduction: PropTypes.bool,
    me: SoapboxPropTypes.me,
    theme: PropTypes.string,
    reduceMotion: PropTypes.bool,
    systemFont: PropTypes.bool,
    dyslexicFont: PropTypes.bool,
    demetricator: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    themeCss: PropTypes.string,
    dispatch: PropTypes.func,
  };

  getThemeChunk = theme => {
    const cssChunks = JSON.parse(document.getElementById('css-chunks').innerHTML);
    return cssChunks.filter(chunk => chunk.startsWith(theme))[0];
  };

  componentDidMount() {
    this.props.dispatch(generateTheme('#0482d8', 'light'));
  }

  render() {
    const { me, theme, themeCss, reduceMotion, systemFont, dyslexicFont, demetricator, locale } = this.props;
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
            {theme && <link rel='stylesheet' href={`/packs/css/${this.getThemeChunk(theme)}.chunk.css`} />}
            {themeCss && <style id='theme' type='text/css'>{`:root{${themeCss}}`}</style>}
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

export default class Soapbox extends React.PureComponent {

  render() {
    return (
      <Provider store={store}>
        <ErrorBoundary>
          <SoapboxMount />
        </ErrorBoundary>
      </Provider>
    );
  }

}
