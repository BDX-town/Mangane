import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { fetchFavourites } from 'soapbox/actions/interactions';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Modal, Spinner } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';

const mapStateToProps = (state, props) => {
  return {
    accountIds: state.getIn(['user_lists', 'favourited_by', props.statusId]),
  };
};

export default @connect(mapStateToProps)
class FavouritesModal extends React.PureComponent {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    statusId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
  };

  fetchData = () => {
    const { dispatch, statusId } = this.props;

    dispatch(fetchFavourites(statusId));
  }

  componentDidMount() {
    this.fetchData();
  }

  onClickClose = () => {
    this.props.onClose('FAVOURITES');
  };

  render() {
    const { accountIds } = this.props;

    let body;

    if (!accountIds) {
      body = <Spinner />;
    } else {
      const emptyMessage = <FormattedMessage id='empty_column.favourites' defaultMessage='No one has liked this post yet. When someone does, they will show up here.' />;

      body = (
        <ScrollableList
          scrollKey='favourites'
          emptyMessage={emptyMessage}
          itemClassName='pb-3'
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} />,
          )}
        </ScrollableList>
      );
    }

    return (
      <Modal
        title={<FormattedMessage id='column.favourites' defaultMessage='likes' />}
        onClose={this.onClickClose}
      >
        {body}
      </Modal>
    );
  }

}
