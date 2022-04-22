import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import AutosuggestAccountInput from 'soapbox/components/autosuggest_account_input';
import Icon from 'soapbox/components/icon';

const messages = defineMessages({
  placeholder: { id: 'account_search.placeholder', defaultMessage: 'Search for an account' },
});

export default @injectIntl
class AccountSearch extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onSelected: PropTypes.func.isRequired,
  };

  state = {
    value: '',
  }

  isEmpty = () => {
    const { value } = this.state;
    return !(value.length > 0);
  }

  clearState = () => {
    this.setState({ value: '' });
  }

  handleChange = ({ target }) => {
    this.setState({ value: target.value });
  }

  handleSelected = accountId => {
    this.clearState();
    this.props.onSelected(accountId);
  }

  handleClear = e => {
    e.preventDefault();

    if (!this.isEmpty()) {
      this.setState({ value: '' });
    }
  }

  handleKeyDown = e => {
    if (e.key === 'Escape') {
      document.querySelector('.ui').parentElement.focus();
    }
  }

  render() {
    const { intl, onSelected, ...rest } = this.props;
    const { value } = this.state;
    const isEmpty = this.isEmpty();

    return (
      <div className='search search--account'>
        <label>
          <span style={{ display: 'none' }}>{intl.formatMessage(messages.placeholder)}</span>
          <AutosuggestAccountInput
            className='search__input'
            placeholder={intl.formatMessage(messages.placeholder)}
            value={value}
            onChange={this.handleChange}
            onSelected={this.handleSelected}
            onKeyDown={this.handleKeyDown}
            {...rest}
          />
        </label>
        <div role='button' tabIndex='0' className='search__icon' onClick={this.handleClear}>
          <Icon src={require('@tabler/icons/icons/search.svg')} className={classNames('svg-icon--search', { active: isEmpty })} />
          <Icon src={require('@tabler/icons/icons/backspace.svg')} className={classNames('svg-icon--backspace', { active: !isEmpty })} aria-label={intl.formatMessage(messages.placeholder)} />
        </div>
      </div>
    );
  }

}
