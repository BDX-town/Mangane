import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import LoadingIndicator from '../../../components/loading_indicator';
import {
	fetchRemovedAccounts,
	expandRemovedAccounts,
	removeRemovedAccount,
} from '../../../actions/groups';
import { FormattedMessage } from 'react-intl';
import AccountContainer from '../../../containers/account_container';
import Column from '../../ui/components/column';
import ScrollableList from '../../../components/scrollable_list';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
	remove: { id: 'groups.removed_accounts', defaultMessage: 'Allow joining' },
});

const mapStateToProps = (state, { params: { id } }) => ({
	group: state.getIn(['groups', id]),
	accountIds: state.getIn(['user_lists', 'groups_removed_accounts', id, 'items']),
	hasMore: !!state.getIn(['user_lists', 'groups_removed_accounts', id, 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class GroupRemovedAccounts extends ImmutablePureComponent {

	static propTypes = {
		params: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
		accountIds: ImmutablePropTypes.list,
		hasMore: PropTypes.bool,
	};

	componentWillMount () {
		const { params: { id } } = this.props;

		this.props.dispatch(fetchRemovedAccounts(id));
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.params.id !== this.props.params.id) {
			this.props.dispatch(fetchRemovedAccounts(nextProps.params.id));
		}
	}

	handleLoadMore = debounce(() => {
		this.props.dispatch(expandRemovedAccounts(this.props.params.id));
	}, 300, { leading: true });

	render () {
		const { accountIds, hasMore, group, intl } = this.props;

		if (!group || !accountIds) {
			return (
				<Column>
					<LoadingIndicator />
				</Column>
			);
		}

		return (
			<Column>
				<ScrollableList
					scrollKey='removed_accounts'
					hasMore={hasMore}
					onLoadMore={this.handleLoadMore}
					emptyMessage={<FormattedMessage id='group.removed_accounts.empty' defaultMessage='This group does not has any removed accounts.' />}
				>
					{accountIds.map(id => <AccountContainer 
						key={id}
						id={id}
						actionIcon="remove"
						onActionClick={() => this.props.dispatch(removeRemovedAccount(group.get('id'), id))}
						actionTitle={intl.formatMessage(messages.remove)}
					/>)}
				</ScrollableList>
			</Column>
		);
	}
}
