'use strict';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { IntlProvider } from 'react-intl';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';

import { loadInstance } from 'soapbox/actions/instance';
import { fetchMe } from 'soapbox/actions/me';
import { getSettings } from 'soapbox/actions/settings';
import { loadSoapboxConfig } from 'soapbox/actions/soapbox';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { fetchVerificationConfig } from 'soapbox/actions/verification';
import { FE_SUBDIRECTORY } from 'soapbox/build_config';
import { NODE_ENV } from 'soapbox/build_config';
import Helmet from 'soapbox/components/helmet';
import AuthLayout from 'soapbox/features/auth_layout';
import OnboardingWizard from 'soapbox/features/onboarding/onboarding-wizard';
import PublicLayout from 'soapbox/features/public_layout';
import NotificationsContainer from 'soapbox/features/ui/containers/notifications_container';
import WaitlistPage from 'soapbox/features/verification/waitlist_page';
import { createGlobals } from 'soapbox/globals';
import messages from 'soapbox/locales/messages';
import { makeGetAccount } from 'soapbox/selectors';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';
import { generateThemeCss } from 'soapbox/utils/theme';

import { checkOnboardingStatus } from '../actions/onboarding';
import { preload } from '../actions/preload';
import ErrorBoundary from '../components/error_boundary';
import UI from '../features/ui';
import { store } from '../store';

const validLocale = locale => Object.keys(messages).includes(locale);

// Delay rendering until instance has loaded or failed (for feature detection)
const isInstanceLoaded = state => {
  const v = state.getIn(['instance', 'version'], '0.0.0');
  const fetchFailed = state.getIn(['meta', 'instance_fetch_failed'], false);

  return v !== '0.0.0' || fetchFailed;
};

// Configure global functions for developers
createGlobals(store);

store.dispatch(preload());

store.dispatch(fetchMe())
  .then(account => {
    // Postpone for authenticated fetch
    store.dispatch(loadInstance());
    store.dispatch(loadSoapboxConfig());
    store.dispatch(checkOnboardingStatus());

    if (!account) {
      store.dispatch(fetchVerificationConfig());
    }
  })
  .catch(console.error);

const makeAccount = makeGetAccount();

const mapStateToProps = (state) => {
  const me = state.get('me');
  const account = makeAccount(state, me);
  const settings = getSettings(state);
  const soapboxConfig = getSoapboxConfig(state);
  const locale = settings.get('locale');

  const singleUserMode = soapboxConfig.get('singleUserMode') && soapboxConfig.get('singleUserModeProfile');

  return {
    me,
    account,
    instanceLoaded: isInstanceLoaded(state),
    reduceMotion: settings.get('reduceMotion'),
    underlineLinks: settings.get('underlineLinks'),
    systemFont: settings.get('systemFont'),
    dyslexicFont: settings.get('dyslexicFont'),
    demetricator: settings.get('demetricator'),
    locale: validLocale(locale) ? locale : 'en',
    themeCss: generateThemeCss(soapboxConfig),
    brandColor: soapboxConfig.get('brandColor'),
    themeMode: settings.get('themeMode'),
    singleUserMode,
    needsOnboarding: state.onboarding.needsOnboarding,
  };
};

@connect(mapStateToProps)
class SoapboxMount extends React.PureComponent {

  static propTypes = {
    me: SoapboxPropTypes.me,
    account: ImmutablePropTypes.record,
    instanceLoaded: PropTypes.bool,
    reduceMotion: PropTypes.bool,
    underlineLinks: PropTypes.bool,
    systemFont: PropTypes.bool,
    needsOnboarding: PropTypes.bool,
    dyslexicFont: PropTypes.bool,
    demetricator: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    themeCss: PropTypes.string,
    themeMode: PropTypes.string,
    brandColor: PropTypes.string,
    dispatch: PropTypes.func,
    singleUserMode: PropTypes.bool,
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

  shouldUpdateScroll(prevRouterProps, { location }) {
    return !(location.state?.soapboxModalKey && location.state?.soapboxModalKey !== prevRouterProps?.location?.state?.soapboxModalKey);
  }

  render() {
    const { me, account, instanceLoaded, themeCss, locale, singleUserMode } = this.props;
    if (me === null) return null;
    if (me && !account) return null;
    if (!instanceLoaded) return null;
    if (this.state.localeLoading) return null;

    const waitlisted = account && !account.getIn(['source', 'approved'], true);

    // Disabling introduction for launch
    const { needsOnboarding } = this.props;

    if (needsOnboarding) {
      return (
        <IntlProvider locale={locale} messages={this.state.messages}>
          <Helmet>
            <html lang='en' className={classNames({ dark: this.props.themeMode === 'dark' })} />
            <body className={bodyClass} />
            {themeCss && <style id='theme' type='text/css'>{`:root{${themeCss}}`}</style>}
            <meta name='theme-color' content={this.props.brandColor} />
          </Helmet>

          <OnboardingWizard />
          <NotificationsContainer />
        </IntlProvider>
      );
    }

    const bodyClass = classNames('bg-white dark:bg-slate-900 text-base', {
      'no-reduce-motion': !this.props.reduceMotion,
      'underline-links': this.props.underlineLinks,
      'dyslexic': this.props.dyslexicFont,
      'demetricator': this.props.demetricator,
    });

    return (
      <IntlProvider locale={locale} messages={this.state.messages}>
        <Helmet>
          <html lang='en' className={classNames({ dark: this.props.themeMode === 'dark' })} />
          <body className={bodyClass} />
          {themeCss && <style id='theme' type='text/css'>{`:root{${themeCss}}`}</style>}
          <meta name='theme-color' content={this.props.brandColor} />
        </Helmet>

        <ErrorBoundary>
          <BrowserRouter basename={FE_SUBDIRECTORY}>
            <>
              <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
                <Switch>
                  <Redirect from='/v1/verify_email/:token' to='/auth/verify/email/:token' />

                  {waitlisted && <Route render={(props) => <WaitlistPage {...props} account={account} />} />}

                  {!me && (singleUserMode
                    ? <Redirect exact from='/' to={`/${singleUserMode}`} />
                    : <Route exact path='/' component={PublicLayout} />)}

                  {!me && <Route exact path='/' component={PublicLayout} />}
                  <Route exact path='/about/:slug?' component={PublicLayout} />
                  <Route exact path='/beta/:slug?' component={PublicLayout} />
                  <Route exact path='/mobile/:slug?' component={PublicLayout} />
                  <Route exact path='/login' component={AuthLayout} />
                  <Route path='/auth/verify' component={AuthLayout} />
                  <Route path='/reset-password' component={AuthLayout} />
                  <Route path='/edit-password' component={AuthLayout} />

                  <Redirect from='/auth/reset_password' to='/reset-password' />
                  <Redirect from='/auth/edit_password' to='/edit-password' />
                  <Redirect from='/auth/sign_in' to='/login' />

                  <Route path='/' component={UI} />
                </Switch>
              </ScrollContext>
            </>
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
      'font-family: system-ui, -apple-system, BlinkMacSystemFont, Ubuntu, "Helvetica Neue", sans-serif',
      'font-size: 50px',
      'font-weight: 800',
      'padding: 4px 0',
    ].join(';'));
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here it is a scam and will give them access to your account.', [
      'color: #111111',
      'display: block',
      'font-family: system-ui, -apple-system, BlinkMacSystemFont, Ubuntu, "Helvetica Neue", sans-serif',
      'font-size: 18px',
      'padding: 4px 0 16px',
    ].join(';'));
    /* eslint-enable no-console */
  }

  componentDidMount() {
    if (NODE_ENV === 'production') {
      this.printConsoleWarning();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <SoapboxMount />
      </Provider>
    );
  }

}
