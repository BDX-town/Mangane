import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from 'soapbox/components/icon';
import { captureException } from 'soapbox/monitoring';

export default class ErrorBoundary extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
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

    if (!hasError) {
      return this.props.children;
    }

    const errorText = this.getErrorText();

    return (
      <div className='error-boundary'>
        <div>
          <Icon src={require('@tabler/icons/icons/mood-sad.svg')} className='sad-face' />
          <FormattedMessage id='alert.unexpected.message' defaultMessage='An unexpected error occurred.' />
          <div className='return-home'>
            <a a href='/'>
              <Icon src={require('@tabler/icons/icons/arrow-back.svg')} />
              <FormattedMessage id='alert.unexpected.return_home' defaultMessage='Return Home' />
            </a>
          </div>
          {errorText && <textarea
            ref={this.setTextareaRef}
            className='error-boundary__component-stack'
            value={errorText}
            onClick={this.handleCopy}
            readOnly
          />}
          {browser && <p className='error-boundary__browser'>
            {browser.getBrowserName()} {browser.getBrowserVersion()}
          </p>}
          <p className='help-text'>
            <FormattedMessage
              id='alert.unexpected.help_text'
              defaultMessage='If the problem persists, please notify a site admin with a screenshot and information about your web browser. You may also {clear_cookies} (this will log you out).'
              values={{ clear_cookies: (
                <a href='/' onClick={this.clearCookies}>
                  <FormattedMessage
                    id='alert.unexpected.clear_cookies'
                    defaultMessage='clear cookies and browser data'
                  />
                </a>
              ) }}
            />
          </p>
        </div>
      </div>
    );
  }

}
