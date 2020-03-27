import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeValue, submit, reset } from '../../../actions/group_editor';
import Icon from '../../../components/icon';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';

const messages = defineMessages({
	title: { id: 'groups.form.title', defaultMessage: 'Enter a new group title' },
	description: { id: 'groups.form.description', defaultMessage: 'Enter the group description' },
	coverImage: { id: 'groups.form.coverImage', defaultMessage: 'Upload a banner image' },
	coverImageChange: { id: 'groups.form.coverImageChange', defaultMessage: 'Banner image selected' },
	create: { id: 'groups.form.create', defaultMessage: 'Create group' },
});

const mapStateToProps = state => ({
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
	reset: () => dispatch(reset()),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Create extends React.PureComponent {

	static contextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		coverImage: PropTypes.object,
		disabled: PropTypes.bool,
		intl: PropTypes.object.isRequired,
		onTitleChange: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.props.reset();
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
		this.props.onSubmit(this.context.router.history);
	}

	render () {
		const { title, description, coverImage, disabled, intl } = this.props;

		return (
			<form className='group-form' onSubmit={this.handleSubmit}>
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
					<button className='standard-small'>{intl.formatMessage(messages.create)}</button>
				</div>
			</form>
		);
	}

}
