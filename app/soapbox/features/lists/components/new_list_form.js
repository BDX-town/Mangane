import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeListEditorTitle, submitListEditor } from '../../../actions/lists';
import Button from '../../../components/button';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  label: { id: 'lists.new.title_placeholder', defaultMessage: 'New list title' },
  title: { id: 'lists.new.create', defaultMessage: 'Add list' },
  create: { id: 'lists.new.create_title', defaultMessage: 'Create' },
});

const mapStateToProps = state => ({
  value: state.getIn(['listEditor', 'title']),
  disabled: state.getIn(['listEditor', 'isSubmitting']),
});

const mapDispatchToProps = dispatch => ({
  onChange: value => dispatch(changeListEditorTitle(value)),
  onSubmit: () => dispatch(submitListEditor(true)),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class NewListForm extends React.PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  handleChange = e => {
    this.props.onChange(e.target.value);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  }

  handleClick = e => {
    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
    const { value, disabled, intl } = this.props;

    const label = intl.formatMessage(messages.label);
    const create = intl.formatMessage(messages.create);

    return (
      <form className='column-inline-form' method='post' onSubmit={this.handleSubmit}>
        <label>
          <span style={{ display: 'none' }}>{label}</span>

          <input
            className='setting-text new-list-form__input'
            value={value}
            disabled={disabled}
            onChange={this.handleChange}
            placeholder={label}
          />
        </label>

        <Button
          className='new-list-form__btn'
          disabled={disabled}
          onClick={this.handleClick}
        >
          {create}
        </Button>
      </form>
    );
  }

}
