import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingIndicator from '../../components/loading_indicator';
import { fetchFavourites } from '../../actions/interactions';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import AccountContainer from '../../containers/account_container';
import Column from '../ui/components/column';
import ScrollableList from '../../components/scrollable_list';

const messages = defineMessages({
  heading: { id: 'column.favourites', defaultMessage: 'Likes' },
});

const mapStateToProps = (state, props) => ({
  accountIds: state.getIn(['user_lists', 'favourited_by', props.params.statusId]),
});

export default @connect(mapStateToProps)
@injectIntl
class Favourites extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
  };

  componentDidMount() {
    this.props.dispatch(fetchFavourites(this.props.params.statusId));
  }

  componentDidUpdate(prevProps) {
    const { statusId } = this.props.params;
    const { prevStatusId } = prevProps.params;

    if (statusId !== prevStatusId && statusId) {
      this.props.dispatch(fetchFavourites(statusId));
    }
  }

  render() {
    const { intl, accountIds } = this.props;

    if (!accountIds) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='empty_column.favourites' defaultMessage='No one has liked this post yet. When someone does, they will show up here.' />;

    return (
      <Column heading={intl.formatMessage(messages.heading)}>
        <ScrollableList
          scrollKey='favourites'
          emptyMessage={emptyMessage}
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
