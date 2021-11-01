import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Icon from 'soapbox/components/icon';
import AutosuggestAccountInput from 'soapbox/components/autosuggest_account_input';
import classNames from 'classnames';

const messages = defineMessages({
  placeholder: { id: 'search.placeholder', defaultMessage: 'Search' },
  action: { id: 'search.action', defaultMessage: 'Search for “{query}”' },
});

export default @injectIntl
class Search extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    value: PropTypes.string.isRequired,
    submitted: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onShow: PropTypes.func.isRequired,
    onSelected: PropTypes.func,
    openInRoute: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autosuggest: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    autoFocus: false,
    ausosuggest: false,
  }

  state = {
    expanded: false,
  };

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  }

  handleClear = (e) => {
    e.preventDefault();

    if (this.props.value.length > 0 || this.props.submitted) {
      this.props.onClear();
    }
  }

  handleSubmit = () => {
    this.props.onSubmit();

    if (this.props.openInRoute) {
      this.context.router.history.push('/search');
    }
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleSubmit();
    } else if (e.key === 'Escape') {
      document.querySelector('.ui').parentElement.focus();
    }
  }

  handleFocus = () => {
    this.setState({ expanded: true });
    this.props.onShow();
  }

  handleBlur = () => {
    this.setState({ expanded: false });
  }

  handleSelected = accountId => {
    const { onSelected } = this.props;

    if (onSelected) {
      onSelected(accountId, this.context.router.history);
    }
  }

  makeMenu = () => {
    const { intl, value } = this.props;

    return [
      { text: intl.formatMessage(messages.action, { query: value }), action: this.handleSubmit },
    ];
  }

  render() {
    const { intl, value, autoFocus, autosuggest, submitted } = this.props;
    const hasValue = value.length > 0 || submitted;

    const Component = autosuggest ? AutosuggestAccountInput : 'input';

    return (
      <div className='search'>
        <label>
          <span style={{ display: 'none' }}>{intl.formatMessage(messages.placeholder)}</span>
          <Component
            className='search__input'
            type='text'
            placeholder={intl.formatMessage(messages.placeholder)}
            value={value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onSelected={this.handleSelected}
            autoFocus={autoFocus}
            autoSelect={false}
            menu={this.makeMenu()}
          />
        </label>
        <div role='button' tabIndex='0' className='search__icon' onClick={this.handleClear}>
          <Icon src={require('@tabler/icons/icons/search.svg')} className={classNames('svg-icon--search', { active: !hasValue })} />
          <Icon src={require('@tabler/icons/icons/backspace.svg')} className={classNames('svg-icon--backspace', { active: hasValue })} aria-label={intl.formatMessage(messages.placeholder)} />
        </div>
      </div>
    );
  }

}
