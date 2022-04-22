import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from 'soapbox/components/button';
import Icon from 'soapbox/components/icon';

import { fetchListSuggestions, clearListSuggestions, changeListSuggestions } from '../../../actions/lists';

const messages = defineMessages({
  search: { id: 'lists.search', defaultMessage: 'Search among people you follow' },
  searchTitle: { id: 'tabs_bar.search', defaultMessage: 'Search' },
});

const mapStateToProps = state => ({
  value: state.getIn(['listEditor', 'suggestions', 'value']),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: value => dispatch(fetchListSuggestions(value)),
  onClear: () => dispatch(clearListSuggestions()),
  onChange: value => dispatch(changeListSuggestions(value)),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Search extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  };

  handleChange = e => {
    this.props.onChange(e.target.value);
  }

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      this.props.onSubmit(this.props.value);
    }
  }

  handleSubmit = () => {
    this.props.onSubmit(this.props.value);
  }

  handleClear = () => {
    this.props.onClear();
  }

  render() {
    const { value, intl } = this.props;
    const hasValue = value.length > 0;

    return (
      <div className='list-editor__search search'>
        <label>
          <span style={{ display: 'none' }}>{intl.formatMessage(messages.search)}</span>

          <input
            className='search__input'
            type='text'
            value={value}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
            placeholder={intl.formatMessage(messages.search)}
          />
        </label>

        <div role='button' tabIndex='0' className='search__icon' onClick={this.handleClear}>
          <Icon src={require('@tabler/icons/icons/backspace.svg')} aria-label={intl.formatMessage(messages.search)} className={classNames('svg-icon--backspace', { active: hasValue })} />
        </div>
        <Button onClick={this.handleSubmit}>{intl.formatMessage(messages.searchTitle)}</Button>
      </div>
    );
  }

}
