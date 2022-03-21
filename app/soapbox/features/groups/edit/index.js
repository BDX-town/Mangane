import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MissingIndicator from 'soapbox/components/missing_indicator';
import { Column, Spinner } from 'soapbox/components/ui';

import { changeValue, submit, setUp } from '../../../actions/group_editor';

const messages = defineMessages({
  title: { id: 'groups.form.title', defaultMessage: 'Title' },
  description: { id: 'groups.form.description', defaultMessage: 'Description' },
  coverImage: { id: 'groups.form.coverImage', defaultMessage: 'Upload new banner image (optional)' },
  coverImageChange: { id: 'groups.form.coverImageChange', defaultMessage: 'Banner image selected' },
  update: { id: 'groups.form.update', defaultMessage: 'Update group' },
});

const mapStateToProps = (state, props) => ({
  group: state.getIn(['groups', props.params.id]),
  title: state.getIn(['group_editor', 'title']),
  description: state.getIn(['group_editor', 'description']),
  coverImage: state.getIn(['group_editor', 'coverImage']),
  disabled: state.getIn(['group_editor', 'isSubmitting']),
});

const mapDispatchToProps = dispatch => ({
  onTitleChange: value => dispatch(changeValue('title', value)),
  onDescriptionChange: value => dispatch(changeValue('description', value)),
  onCoverImageChange: value => dispatch(changeValue('coverImage', value)),
  onSubmit: routerHistory => dispatch(submit(routerHistory)),
  setUp: group => dispatch(setUp(group)),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
@withRouter
class Edit extends React.PureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverImage: PropTypes.object,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDescriptionChange: PropTypes.func.isRequired,
    onCoverImageChange: PropTypes.func.isRequired,
    setUp: PropTypes.func.isRequired,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    if (props.group) props.setUp(props.group);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.group && this.props.group) {
      this.props.setUp(this.props.group);
    }
  }

  handleTitleChange = e => {
    this.props.onTitleChange(e.target.value);
  }

  handleDescriptionChange = e => {
    this.props.onDescriptionChange(e.target.value);
  }

  handleCoverImageChange = e => {
    this.props.onCoverImageChange(e.target.files[0]);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.props.history);
  }

  handleClick = () => {
    this.props.onSubmit(this.props.history);
  }

  render() {
    const { group, title, description, coverImage, disabled, intl } = this.props;

    if (typeof group === 'undefined') {
      return (
        <Column>
          <Spinner />
        </Column>
      );
    } else if (group === false) {
      return (
        <MissingIndicator />
      );
    }

    return (
      <form className='group-form' method='post' onSubmit={this.handleSubmit}>
        <div>
          <input
            className='standard'
            type='text'
            value={title}
            disabled={disabled}
            onChange={this.handleTitleChange}
            placeholder={intl.formatMessage(messages.title)}
          />
        </div>

        <div>
          <textarea
            className='standard'
            type='text'
            value={description}
            disabled={disabled}
            onChange={this.handleDescriptionChange}
            placeholder={intl.formatMessage(messages.description)}
          />
        </div>

        <div>
          <label htmlFor='group_cover_image' className={classNames('group-form__file-label', { 'group-form__file-label--selected': coverImage !== null })}>
            {intl.formatMessage(coverImage === null ? messages.coverImage : messages.coverImageChange)}
          </label>

          <input
            type='file'
            className='group-form__file'
            id='group_cover_image'
            disabled={disabled}
            onChange={this.handleCoverImageChange}
          />

          <button>{intl.formatMessage(messages.update)}</button>
        </div>
      </form>
    );
  }

}
