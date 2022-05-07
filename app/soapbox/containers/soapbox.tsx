'use strict';

import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
// @ts-ignore: it doesn't have types
import { ScrollContext } from 'react-router-scroll-4';

import { loadInstance } from 'soapbox/actions/instance';
import { fetchMe } from 'soapbox/actions/me';
import { loadSoapboxConfig } from 'soapbox/actions/soapbox';
import { fetchVerificationConfig } from 'soapbox/actions/verification';
import * as BuildConfig from 'soapbox/build_config';
import Helmet from 'soapbox/components/helmet';
import AuthLayout from 'soapbox/features/auth_layout';
import OnboardingWizard from 'soapbox/features/onboarding/onboarding-wizard';
import PublicLayout from 'soapbox/features/public_layout';
import NotificationsContainer from 'soapbox/features/ui/containers/notifications_container';
import WaitlistPage from 'soapbox/features/verification/waitlist_page';
import { createGlobals } from 'soapbox/globals';
import { useAppSelector, useAppDispatch, useOwnAccount, useFeatures, useSoapboxConfig, useSettings } from 'soapbox/hooks';
import MESSAGES from 'soapbox/locales/messages';
import { getFeatures } from 'soapbox/utils/features';
import { generateThemeCss } from 'soapbox/utils/theme';

import { checkOnboardingStatus } from '../actions/onboarding';
import { preload } from '../actions/preload';
import ErrorBoundary from '../components/error_boundary';
import UI from '../features/ui';
import { store } from '../store';

/** Ensure the given locale exists in our codebase */
const validLocale = (locale: string): boolean => Object.keys(MESSAGES).includes(locale);

// Configure global functions for developers
createGlobals(store);

// Preload happens synchronously
store.dispatch(preload() as any);

// This happens synchronously
store.dispatch(checkOnboardingStatus() as any);

/** Load initial data from the backend */
const loadInitial = () => {
  // @ts-ignore
  return async(dispatch, getState) => {
    // Await for authenticated fetch
    await dispatch(fetchMe());
    // Await for feature detection
    await dispatch(loadInstance());

    const promises = [];

    promises.push(dispatch(loadSoapboxConfig()));

    const state = getState();
    const features = getFeatures(state.instance);

    if (features.pepe && !state.me) {
      promises.push(dispatch(fetchVerificationConfig()));
    }

    await Promise.all(promises);
  };
};

const SoapboxMount = () => {
  const dispatch = useAppDispatch();

  const me = useAppSelector(state => state.me);
  const instance = useAppSelector(state => state.instance);
  const account = useOwnAccount();
  const settings = useSettings();
  const soapboxConfig = useSoapboxConfig();
  const features = useFeatures();

  const locale = validLocale(settings.get('locale')) ? settings.get('locale') : 'en';

  const needsOnboarding = useAppSelector(state => state.onboarding.needsOnboarding);
  const singleUserMode = soapboxConfig.singleUserMode && soapboxConfig.singleUserModeProfile;

  const [messages, setMessages] = useState<Record<string, string>>({});
  const [localeLoading, setLocaleLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  const [isSystemDarkMode, setSystemDarkMode] = useState(colorSchemeQueryList.matches);
  const userTheme = settings.get('themeMode');
  const darkMode = userTheme === 'dark' || (userTheme === 'system' && isSystemDarkMode);

  const themeCss = generateThemeCss(soapboxConfig);

  const handleSystemModeChange = (event: MediaQueryListEvent) => {
    setSystemDarkMode(event.matches);
  };

  // Load the user's locale
  useEffect(() => {
    MESSAGES[locale]().then(messages => {
      setMessages(messages);
      setLocaleLoading(false);
    }).catch(() => {});
  }, [locale]);

  // Load initial data from the API
  useEffect(() => {
    dispatch(loadInitial()).then(() => {
      setIsLoaded(true);
    }).catch(() => {
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    colorSchemeQueryList.addEventListener('change', handleSystemModeChange);

    return () => colorSchemeQueryList.removeEventListener('change', handleSystemModeChange);
  }, []);

  // @ts-ignore: I don't actually know what these should be, lol
  const shouldUpdateScroll = (prevRouterProps, { location }) => {
    return !(location.state?.soapboxModalKey && location.state?.soapboxModalKey !== prevRouterProps?.location?.state?.soapboxModalKey);
  };

  if (me === null) return null;
  if (me && !account) return null;
  if (!isLoaded) return null;
  if (localeLoading) return null;

  const waitlisted = account && !account.source.get('approved', true);

  const bodyClass = classNames('bg-white dark:bg-slate-900 text-base', {
    'no-reduce-motion': !settings.get('reduceMotion'),
    'underline-links': settings.get('underlineLinks'),
    'dyslexic': settings.get('dyslexicFont'),
    'demetricator': settings.get('demetricator'),
  });

  if (account && !waitlisted && needsOnboarding) {
    return (
      <IntlProvider locale={locale} messages={messages}>
        <Helmet>
          <html lang={locale} className={classNames({ dark: darkMode })} />
          <body className={bodyClass} />
          {themeCss && <style id='theme' type='text/css'>{`:root{${themeCss}}`}</style>}
          <meta name='theme-color' content={soapboxConfig.brandColor} />
        </Helmet>

        <ErrorBoundary>
          <BrowserRouter basename={BuildConfig.FE_SUBDIRECTORY}>
            <OnboardingWizard />
            <NotificationsContainer />
          </BrowserRouter>
        </ErrorBoundary>
      </IntlProvider>
    );
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Helmet>
        <html lang={locale} className={classNames({ dark: darkMode })} />
        <body className={bodyClass} />
        {themeCss && <style id='theme' type='text/css'>{`:root{${themeCss}}`}</style>}
        <meta name='theme-color' content={soapboxConfig.brandColor} />
      </Helmet>

      <ErrorBoundary>
        <BrowserRouter basename={BuildConfig.FE_SUBDIRECTORY}>
          <>
            <ScrollContext shouldUpdateScroll={shouldUpdateScroll}>
              <Switch>
                <Redirect from='/v1/verify_email/:token' to='/verify/email/:token' />

                {waitlisted && <Route render={(props) => <WaitlistPage {...props} account={account} />} />}

                {!me && (singleUserMode
                  ? <Redirect exact from='/' to={`/${singleUserMode}`} />
                  : <Route exact path='/' component={PublicLayout} />)}

                {!me && <Route exact path='/' component={PublicLayout} />}
                <Route exact path='/about/:slug?' component={PublicLayout} />
                <Route exact path='/beta/:slug?' component={PublicLayout} />
                <Route exact path='/mobile/:slug?' component={PublicLayout} />
                <Route path='/login' component={AuthLayout} />
                {(features.accountCreation && instance.registrations) && (
                  <Route exact path='/signup' component={AuthLayout} />
                )}
                <Route path='/verify' component={AuthLayout} />
                <Route path='/reset-password' component={AuthLayout} />
                <Route path='/edit-password' component={AuthLayout} />
                <Route path='/invite/:token' component={AuthLayout} />

                <Route path='/' component={UI} />
              </Switch>
            </ScrollContext>
          </>
        </BrowserRouter>
      </ErrorBoundary>
    </IntlProvider>
  );
};

const Soapbox = () => {
  return (
    <Provider store={store}>
      <SoapboxMount />
    </Provider>
  );
};

export default Soapbox;
