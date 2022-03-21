import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { NODE_ENV } from 'soapbox/build_config';
import { Text, Stack } from 'soapbox/components/ui';
import { captureException } from 'soapbox/monitoring';
import sourceCode from 'soapbox/utils/code';

import { getSoapboxConfig } from '../actions/soapbox';

const mapStateToProps = (state) => {
  const soapboxConfig = getSoapboxConfig(state);

  return {
    siteTitle: state.instance.title,
    helpLink: soapboxConfig.getIn(['links', 'help']),
    supportLink: soapboxConfig.getIn(['links', 'support']),
    statusLink: soapboxConfig.getIn(['links', 'status']),
  };
};

@connect(mapStateToProps)
class ErrorBoundary extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    siteTitle: PropTypes.string,
    supportLink: PropTypes.string,
    helpLink: PropTypes.string,
    statusLink: PropTypes.string,
  };

  state = {
    hasError: false,
    componentStack: undefined,
  }

  componentDidCatch(error, info) {
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

  setTextareaRef = c => {
    this.textarea = c;
  }

  handleCopy = e => {
    if (!this.textarea) return;

    this.textarea.select();
    this.textarea.setSelectionRange(0, 99999);

    document.execCommand('copy');
  }

  getErrorText = () => {
    const { error, componentStack } = this.state;
    return error + componentStack;
  }

  clearCookies = e => {
    localStorage.clear();
    sessionStorage.clear();
  }

  render() {
    const { browser, hasError } = this.state;
    const { children, siteTitle, helpLink, statusLink, supportLink } = this.props;

    if (!hasError) {
      return children;
    }

    const isProduction = NODE_ENV === 'production';

    const errorText = this.getErrorText();

    return (
      <div className='h-screen pt-16 pb-12 flex flex-col bg-white'>
        <main className='flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex-shrink-0 flex justify-center'>
            <a href='/' className='inline-flex'>
              <img className='h-12 w-12' src='/instance/images/app-icon.png' alt={siteTitle} />
            </a>
          </div>

          <div className='py-8'>
            <div className='text-center max-w-xl mx-auto space-y-2'>
              <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl'>
                <FormattedMessage id='alert.unexpected.message' defaultMessage='Something went wrong.' />
              </h1>
              <p className='text-lg text-gray-500'>
                We're sorry for the interruption. If the problem persists, please reach out to our support team. You
                may also try to <a href='/' onClick={this.clearCookies} className='text-gray-700 hover:underline'>
                  <FormattedMessage
                    id='alert.unexpected.clear_cookies'
                    defaultMessage='clear cookies and browser data'
                  />
                </a>
                {' ' }(this will log you out).
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
                    <Text weight='semibold'>Browser</Text>
                    <Text theme='muted'>{browser.getBrowserName()} {browser.getBrowserVersion()}</Text>
                  </Stack>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className='flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <nav className='flex justify-center space-x-4'>
            {statusLink && (
              <>
                <a href={statusLink} className='text-sm font-medium text-gray-500 hover:text-gray-600'>
                  Status
                </a>
              </>
            )}

            {helpLink && (
              <>
                <span className='inline-block border-l border-gray-300' aria-hidden='true' />
                <a href={helpLink} className='text-sm font-medium text-gray-500 hover:text-gray-600'>
                  Help Center
                </a>
              </>
            )}

            {supportLink && (
              <>
                <span className='inline-block border-l border-gray-300' aria-hidden='true' />
                <a href={supportLink} className='text-sm font-medium text-gray-500 hover:text-gray-600'>
                  Support
                </a>
              </>
            )}
          </nav>
        </footer>
      </div>
    );
  }

}

export default ErrorBoundary;
