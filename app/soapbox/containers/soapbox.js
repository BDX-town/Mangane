'use strict';

import React from 'react';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
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
import initialState from '../initial_state';
import { preload } from '../actions/preload';
import { IntlProvider } from 'react-intl';
import ErrorBoundary from '../components/error_boundary';
import { fetchInstance } from 'soapbox/actions/instance';
import { fetchSoapboxConfig } from 'soapbox/actions/soapbox';
import { fetchMe } from 'soapbox/actions/me';
import PublicLayout from 'soapbox/features/public_layout';
import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { generateThemeCss } from 'soapbox/utils/theme';
import messages from 'soapbox/locales/messages';

const validLocale = locale => Object.keys(messages).includes(locale);

export const store = configureStore();

const hydrateAction = hydrateStore(initialState);

store.dispatch(hydrateAction);
store.dispatch(preload());
store.dispatch(fetchMe());
store.dispatch(fetchInstance());
store.dispatch(fetchSoapboxConfig());
store.dispatch(fetchCustomEmojis());

const mapStateToProps = (state) => {
  const me = state.get('me');
  const account = state.getIn(['accounts', me]);
  const showIntroduction = account ? state.getIn(['settings', 'introductionVersion'], 0) < INTRODUCTION_VERSION : false;
  const settings = getSettings(state);
  const soapboxConfig = getSoapboxConfig(state);
  const locale = settings.get('locale');

  return {
    showIntroduction,
    me,
    reduceMotion: settings.get('reduceMotion'),
    systemFont: settings.get('systemFont'),
    dyslexicFont: settings.get('dyslexicFont'),
    demetricator: settings.get('demetricator'),
    locale: validLocale(locale) ? locale : 'en',
    themeCss: generateThemeCss(soapboxConfig.get('brandColor')),
    themeMode: settings.get('themeMode'),
    customCss: soapboxConfig.get('customCss'),
  };
};

@connect(mapStateToProps)
class SoapboxMount extends React.PureComponent {

  static propTypes = {
    showIntroduction: PropTypes.bool,
    me: SoapboxPropTypes.me,
    reduceMotion: PropTypes.bool,
    systemFont: PropTypes.bool,
    dyslexicFont: PropTypes.bool,
    demetricator: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    themeCss: PropTypes.string,
    themeMode: PropTypes.string,
    customCss: ImmutablePropTypes.list,
    dispatch: PropTypes.func,
  };

  state = {
    messages: {},
    localeLoading: true,
  }

  setMessages = () => {
    messages[this.props.locale]().then(messages => {
      this.setState({ messages, localeLoading: false });
    }).catch(() => {});
  }

  maybeUpdateMessages = prevProps => {
    if (this.props.locale !== prevProps.locale) {
      this.setMessages();
    };
  }

  componentDidMount() {
    this.setMessages();
  }

  componentDidUpdate(prevProps) {
    this.maybeUpdateMessages(prevProps);
  }

  render() {
    const { me, themeCss, locale, customCss } = this.props;
    if (me === null) return null;
    if (this.state.localeLoading) return null;

    // Disabling introduction for launch
    // const { showIntroduction } = this.props;
    //
    // if (showIntroduction) {
    //   return <Introduction />;
    // }

    const bodyClass = classNames('app-body', `theme-mode-${this.props.themeMode}`, {
      'system-font': this.props.systemFont,
      'no-reduce-motion': !this.props.reduceMotion,
      'dyslexic': this.props.dyslexicFont,
      'demetricator': this.props.demetricator,
    });

    return (
      <IntlProvider locale={locale} messages={this.state.messages}>
        <>
          <Helmet>
            <body className={bodyClass} />
            {themeCss && <style id='theme' type='text/css'>{`:root{${themeCss}}`}</style>}
            {customCss && customCss.map(css => (
              <link rel='stylesheet' href={css} key={css} />
            ))}
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
