import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import * as BuildConfig from 'soapbox/build_config';
import { Text, Stack } from 'soapbox/components/ui';
import SvgIcon from 'soapbox/components/ui/icon/svg-icon';
import { captureException } from 'soapbox/monitoring';
import KVStore from 'soapbox/storage/kv_store';
import sourceCode from 'soapbox/utils/code';

import type { RootState } from 'soapbox/store';

const goHome = () => location.href = '/';

/** Unregister the ServiceWorker */
// https://stackoverflow.com/a/49771828/8811886
const unregisterSw = async() => {
  if (!navigator.serviceWorker) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  const unregisterAll = registrations.map(r => r.unregister());
  await Promise.all(unregisterAll);
};

const mapStateToProps = (state: RootState) => {
  const { links, logo } = getSoapboxConfig(state);

  return {
    siteTitle: state.instance.title,
    logo,
    links,
  };
};

type Props = ReturnType<typeof mapStateToProps>;

type State = {
  hasError: boolean,
  error: any,
  componentStack: any,
  browser?: Bowser.Parser.Parser,
}

class ErrorBoundary extends React.PureComponent<Props, State> {

  state: State = {
    hasError: false,
    error: undefined,
    componentStack: undefined,
    browser: undefined,
  }

  textarea: HTMLTextAreaElement | null = null;

  componentDidCatch(error: any, info: any): void {
    captureException(error);

    this.setState({
      hasError: true,
      error,
      componentStack: info && info.componentStack,
    });

    import(/* webpackChunkName: "error" */'bowser')
      .then(({ default: Bowser }) => {
        this.setState({
          browser: Bowser.getParser(window.navigator.userAgent),
        });
      })
      .catch(() => {});
  }

  setTextareaRef: React.RefCallback<HTMLTextAreaElement> = c => {
    this.textarea = c;
  }

  handleCopy: React.MouseEventHandler = () => {
    if (!this.textarea) return;

    this.textarea.select();
    this.textarea.setSelectionRange(0, 99999);

    document.execCommand('copy');
  }

  getErrorText = (): string => {
    const { error, componentStack } = this.state;
    return error + componentStack;
  }

  clearCookies: React.MouseEventHandler = (e) => {
    localStorage.clear();
    sessionStorage.clear();
    KVStore.clear();

    if ('serviceWorker' in navigator) {
      e.preventDefault();
      unregisterSw().then(goHome).catch(goHome);
    }
  }

  render() {
    const { browser, hasError } = this.state;
    const { children, siteTitle, logo, links } = this.props;

    if (!hasError) {
      return children;
    }

    const isProduction = BuildConfig.NODE_ENV === 'production';

    const errorText = this.getErrorText();

    return (
      <div className='h-screen pt-16 pb-12 flex flex-col bg-white'>
        <main className='flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex-shrink-0 flex justify-center'>
            <a href='/' className='inline-flex'>
              {logo ? (
                <img className='h-12' src={logo} alt={siteTitle} />
              ) : (
                <SvgIcon className='h-12 w-12' src={require('@tabler/icons/icons/home.svg')} alt={siteTitle} />
              )}
            </a>
          </div>

          <div className='py-8'>
            <div className='text-center max-w-xl mx-auto space-y-2'>
              <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl'>
                <FormattedMessage id='alert.unexpected.message' defaultMessage='Something went wrong.' />
              </h1>
              <p className='text-lg text-gray-500'>
                <FormattedMessage
                  id='alert.unexpected.body'
                  defaultMessage="We're sorry for the interruption. If the problem persists, please reach out to our support team. You may also try to {clearCookies} (this will log you out)."
                  values={{ clearCookies: (
                    <a href='/' onClick={this.clearCookies} className='text-gray-700 hover:underline'>
                      <FormattedMessage
                        id='alert.unexpected.clear_cookies'
                        defaultMessage='clear cookies and browser data'
                      />
                    </a>
                  ) }}
                />
              </p>

              <Text theme='muted'>
                <Text weight='medium' tag='span' theme='muted'>{sourceCode.displayName}:</Text>

                {' '}{sourceCode.version}
              </Text>

              <div className='mt-10'>
                <a href='/' className='text-base font-medium text-primary-600 hover:text-primary-500'>
                  <FormattedMessage id='alert.unexpected.return_home' defaultMessage='Return Home' />
                  <span aria-hidden='true'> &rarr;</span>
                </a>
              </div>
            </div>

            {!isProduction && (
              <div className='py-16 max-w-lg mx-auto space-y-4'>
                {errorText && (
                  <textarea
                    ref={this.setTextareaRef}
                    className='h-48 p-4 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono'
                    value={errorText}
                    onClick={this.handleCopy}
                    readOnly
                  />
                )}


                {browser && (
                  <Stack>
                    <Text weight='semibold'><FormattedMessage id='alert.unexpected.browser' defaultMessage='Browser' /></Text>
                    <Text theme='muted'>{browser.getBrowserName()} {browser.getBrowserVersion()}</Text>
                  </Stack>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className='flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <nav className='flex justify-center space-x-4'>
            {links.get('status') && (
              <>
                <a href={links.get('status')} className='text-sm font-medium text-gray-500 hover:text-gray-600'>
                  <FormattedMessage id='alert.unexpected.links.status' defaultMessage='Status' />
                </a>
              </>
            )}

            {links.get('help') && (
              <>
                <span className='inline-block border-l border-gray-300' aria-hidden='true' />
                <a href={links.get('help')} className='text-sm font-medium text-gray-500 hover:text-gray-600'>
                  <FormattedMessage id='alert.unexpected.links.help' defaultMessage='Help Center' />
                </a>
              </>
            )}

            {links.get('support') && (
              <>
                <span className='inline-block border-l border-gray-300' aria-hidden='true' />
                <a href={links.get('support')} className='text-sm font-medium text-gray-500 hover:text-gray-600'>
                  <FormattedMessage id='alert.unexpected.links.support' defaultMessage='Support' />
                </a>
              </>
            )}
          </nav>
        </footer>
      </div>
    );
  }

}

export default connect(mapStateToProps)(ErrorBoundary as any);
