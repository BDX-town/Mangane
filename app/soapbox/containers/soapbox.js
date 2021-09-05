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
import { preload } from '../actions/preload';
import { IntlProvider } from 'react-intl';
import { previewState as previewMediaState } from 'soapbox/features/ui/components/media_modal';
import { previewState as previewVideoState } from 'soapbox/features/ui/components/video_modal';
import ErrorBoundary from '../components/error_boundary';
import { fetchInstance } from 'soapbox/actions/instance';
import { fetchSoapboxConfig } from 'soapbox/actions/soapbox';
import { fetchMe } from 'soapbox/actions/me';
import PublicLayout from 'soapbox/features/public_layout';
import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { generateThemeCss } from 'soapbox/utils/theme';
import messages from 'soapbox/locales/messages';
import { FE_SUBDIRECTORY } from 'soapbox/build_config';

const validLocale = locale => Object.keys(messages).includes(locale);

export const store = configureStore();

store.dispatch(preload());

store.dispatch(fetchMe())
  .then(() => {
    // Postpone for authenticated fetch
    store.dispatch(fetchInstance());
    store.dispatch(fetchSoapboxConfig());
  })
  .catch(() => {});

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
    underlineLinks: settings.get('underlineLinks'),
    systemFont: settings.get('systemFont'),
    dyslexicFont: settings.get('dyslexicFont'),
    demetricator: settings.get('demetricator'),
    locale: validLocale(locale) ? locale : 'en',
    themeCss: generateThemeCss(soapboxConfig.get('brandColor')),
    brandColor: soapboxConfig.get('brandColor'),
    themeMode: settings.get('themeMode'),
    halloween: settings.get('halloween'),
    customCss: soapboxConfig.get('customCss'),
  };
};

@connect(mapStateToProps)
class SoapboxMount extends React.PureComponent {

  static propTypes = {
    showIntroduction: PropTypes.bool,
    me: SoapboxPropTypes.me,
    reduceMotion: PropTypes.bool,
    underlineLinks: PropTypes.bool,
    systemFont: PropTypes.bool,
    dyslexicFont: PropTypes.bool,
    demetricator: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    themeCss: PropTypes.string,
    themeMode: PropTypes.string,
    brandColor: PropTypes.string,
    customCss: ImmutablePropTypes.list,
    halloween: PropTypes.bool,
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
    }
  }

  componentDidMount() {
    this.setMessages();
  }

  componentDidUpdate(prevProps) {
    this.maybeUpdateMessages(prevProps);
  }

  shouldUpdateScroll(_, { location }) {
    return location.state !== previewMediaState && location.state !== previewVideoState;
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
      'underline-links': this.props.underlineLinks,
      'dyslexic': this.props.dyslexicFont,
      'demetricator': this.props.demetricator,
      'halloween': this.props.halloween,
    });

    return (
      <IntlProvider locale={locale} messages={this.state.messages}>
        <ErrorBoundary>
          <Helmet>
            <body className={bodyClass} />
            {themeCss && <style id='theme' type='text/css'>{`:root{${themeCss}}`}</style>}
            {customCss && customCss.map(css => (
              <link rel='stylesheet' href={css} key={css} />
            ))}
            <meta name='theme-color' content={this.props.brandColor} />
          </Helmet>
          <BrowserRouter basename={FE_SUBDIRECTORY}>
            <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
              <Switch>
                {!me && <Route exact path='/' component={PublicLayout} />}
                <Route exact path='/about/:slug?' component={PublicLayout} />
                <Route path='/' component={UI} />
              </Switch>
            </ScrollContext>
          </BrowserRouter>
        </ErrorBoundary>
      </IntlProvider>
    );
  }

}

export default class Soapbox extends React.PureComponent {

  printConsoleWarning = () => {
    /* eslint-disable no-console */
    console.log('%cStop!', [
      'color: #ff0000',
      'display: block',
      'font-family: system-ui, -apple-system, BlinkMacSystemFont, Roboto, Ubuntu, "Helvetica Neue", sans-serif',
      'font-size: 50px',
      'font-weight: 800',
      'padding: 4px 0',
    ].join(';'));
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here it is a scam and will give them access to your account.', [
      'color: #111111',
      'display: block',
      'font-family: system-ui, -apple-system, BlinkMacSystemFont, Roboto, Ubuntu, "Helvetica Neue", sans-serif',
      'font-size: 18px',
      'padding: 4px 0 16px',
    ].join(';'));
    /* eslint-enable no-console */
  }

  componentDidMount() {
    this.printConsoleWarning();
  }

  render() {
    return (
      <Provider store={store}>
        <SoapboxMount />
      </Provider>
    );
  }

}
