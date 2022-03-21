import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { changeListEditorTitle, submitListEditor } from '../../../actions/lists';
import { Button } from '../../../components/ui';

const messages = defineMessages({
  title: { id: 'lists.edit.submit', defaultMessage: 'Change title' },
  save: { id: 'lists.new.save_title', defaultMessage: 'Save Title' },
});

const mapStateToProps = state => ({
  value: state.getIn(['listEditor', 'title']),
  disabled: !state.getIn(['listEditor', 'isChanged']),
});

const mapDispatchToProps = dispatch => ({
  onChange: value => dispatch(changeListEditorTitle(value)),
  onSubmit: () => dispatch(submitListEditor(false)),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListForm extends React.PureComponent {

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

  handleClick = () => {
    this.props.onSubmit();
  }

  render() {
    const { value, disabled, intl } = this.props;
    const save = intl.formatMessage(messages.save);

    return (
      <form className='column-inline-form' method='post' onSubmit={this.handleSubmit}>
        <input
          className='setting-text new-list-form__input'
          value={value}
          onChange={this.handleChange}
        />

        { !disabled &&
          <Button
            className='new-list-form__btn'
            onClick={this.handleClick}
          >
            {save}
          </Button>
        }
      </form>
    );
  }

}
