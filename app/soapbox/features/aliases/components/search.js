import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { fetchAliasesSuggestions, clearAliasesSuggestions, changeAliasesSuggestions } from '../../../actions/aliases';
import classNames from 'classnames';
import Icon from 'soapbox/components/icon';
import Button from 'soapbox/components/button';

const messages = defineMessages({
  search: { id: 'aliases.search', defaultMessage: 'Search your old account' },
  searchTitle: { id: 'tabs_bar.search', defaultMessage: 'Search' },
});

const mapStateToProps = state => ({
  value: state.getIn(['aliases', 'suggestions', 'value']),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: value => dispatch(fetchAliasesSuggestions(value)),
  onClear: () => dispatch(clearAliasesSuggestions()),
  onChange: value => dispatch(changeAliasesSuggestions(value)),
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
      <div className='aliases_search search'>
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
          <Icon id='search' className={classNames({ active: !hasValue })} />
          <Icon id='times-circle' aria-label={intl.formatMessage(messages.search)} className={classNames({ active: hasValue })} />
        </div>
        <Button onClick={this.handleSubmit}>{intl.formatMessage(messages.searchTitle)}</Button>
      </div>
    );
  }

}
