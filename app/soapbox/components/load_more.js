import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from 'soapbox/components/ui';

export default class LoadMore extends React.PureComponent {

  static propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    visible: true,
  }

  render() {
    const { disabled, visible } = this.props;

    if (!visible) {
      return null;
    }

    return (
      <Button theme='secondary' block disabled={disabled || !visible} onClick={this.props.onClick}>
        <FormattedMessage id='status.load_more' defaultMessage='Load more' />
      </Button>
    );
  }

}
