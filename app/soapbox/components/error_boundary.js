import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Bowser from 'bowser';

export default class ErrorBoundary extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    hasError: false,
    componentStack: undefined,
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error,
      componentStack: info && info.componentStack,
    });
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
    const browser = Bowser.getParser(window.navigator.userAgent);

    const { hasError } = this.state;

    if (!hasError) {
      return this.props.children;
    }

    const errorText = this.getErrorText();

    return (
      <div className='error-boundary'>
        <div>
          <i className='fa fa-frown-o' aria-hidden='true' />
          <FormattedMessage id='alert.unexpected.message' defaultMessage='An unexpected error occurred.' />
          <a href='/' className='return-home'>
            <i className='fa fa-reply' aria-hidden='true' />&nbsp;
            <FormattedMessage id='alert.unexpected.return_home' defaultMessage='Return Home' />
          </a>
          {errorText && <textarea
            ref={this.setTextareaRef}
            className='error-boundary__component-stack'
            value={errorText}
            onClick={this.handleCopy}
            readOnly
          />}
          <p className='error-boundary__browser'>
            {browser.getBrowserName()} {browser.getBrowserVersion()}
          </p>
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
