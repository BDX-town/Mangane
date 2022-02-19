import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';

import IconButton from 'soapbox/components/icon_button';
import { FormPropTypes, InputContainer, LabelInputContainer } from 'soapbox/features/forms';

const messages = defineMessages({
  showPassword: { id: 'forms.show_password', defaultMessage: 'Show password' },
  hidePassword: { id: 'forms.hide_password', defaultMessage: 'Hide password' },
});

export default @injectIntl
class ShowablePassword extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    label: FormPropTypes.label,
    className: PropTypes.string,
    hint: PropTypes.node,
    error: PropTypes.bool,
  }

  state = {
    revealed: false,
  }

  toggleReveal = () => {
    if (this.props.onToggleVisibility) {
      this.props.onToggleVisibility();
    } else {
      this.setState({ revealed: !this.state.revealed });
    }
  }

  render() {
    const { intl, hint, error, label, className, ...props } = this.props;
    const { revealed } = this.state;

    const revealButton = (
      <IconButton
        src={revealed ? require('@tabler/icons/icons/eye-off.svg') : require('@tabler/icons/icons/eye.svg')}
        onClick={this.toggleReveal}
        title={intl.formatMessage(revealed ? messages.hidePassword : messages.showPassword)}
      />
    );

    return (
      <InputContainer {...this.props} extraClass={classNames('showable-password', className)}>
        {label ? (
          <LabelInputContainer label={label}>
            <input {...props} type={revealed ? 'text' : 'password'} />
            {revealButton}
          </LabelInputContainer>
        ) : (<>
          <input {...props} type={revealed ? 'text' : 'password'} />
          {revealButton}
        </>)}
      </InputContainer>
    );
  }

}
