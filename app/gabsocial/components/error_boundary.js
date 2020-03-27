import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export default class ErrorBoundary extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    hasError: false,
    stackTrace: undefined,
    componentStack: undefined,
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      stackTrace: error.stack,
      componentStack: info && info.componentStack,
    });
  }

  render() {
    const { hasError } = this.state;

    if (!hasError) {
      return this.props.children;
    }

    return (
      <div className='error-boundary'>
        <div>
          <FormattedMessage id='alert.unexpected.message' defaultMessage='An unexpected error occurred.' />
          <a href='/home'>Return Home</a>
        </div>
      </div>
    );
  }

}
