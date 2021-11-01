import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Icon from 'soapbox/components/icon';
import classNames from 'classnames';

const messages = defineMessages({
  placeholder: { id: 'search.placeholder', defaultMessage: 'Search' },
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
    openInRoute: PropTypes.bool,
    autoFocus: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    autoFocus: false,
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

  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      this.props.onSubmit();

      if (this.props.openInRoute) {
        this.context.router.history.push('/search');
      }
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

  render() {
    const { intl, value, autoFocus, submitted } = this.props;
    const hasValue = value.length > 0 || submitted;

    return (
      <div className='search'>
        <label>
          <span style={{ display: 'none' }}>{intl.formatMessage(messages.placeholder)}</span>
          <input
            className='search__input'
            type='text'
            placeholder={intl.formatMessage(messages.placeholder)}
            value={value}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            autoFocus={autoFocus}
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
