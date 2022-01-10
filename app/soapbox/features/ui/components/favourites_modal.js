import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import { fetchFavourites } from 'soapbox/actions/interactions';
import IconButton from 'soapbox/components/icon_button';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import ScrollableList from 'soapbox/components/scrollable_list';
import AccountContainer from 'soapbox/containers/account_container';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

const mapStateToProps = (state, props) => {
  return {
    accountIds: state.getIn(['user_lists', 'favourited_by', props.statusId]),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class FavouritesModal extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
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
    this.unlistenHistory = this.context.router.history.listen((_, action) => {
      if (action === 'PUSH') {
        this.onClickClose(null, true);
      }
    });
  }

  componentWillUnmount() {
    if (this.unlistenHistory) {
      this.unlistenHistory();
    }
  }

  onClickClose = (_, noPop) => {
    this.props.onClose('FAVOURITES', noPop);
  };

  render() {
    const { intl, accountIds } = this.props;

    let body;

    if (!accountIds) {
      body = <LoadingIndicator />;
    } else {
      const emptyMessage = <FormattedMessage id='empty_column.favourites' defaultMessage='No one has liked this post yet. When someone does, they will show up here.' />;

      body = (
        <ScrollableList
          scrollKey='favourites'
          emptyMessage={emptyMessage}
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      );
    }


    return (
      <div className='modal-root__modal reactions-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'>
            <FormattedMessage id='column.favourites' defaultMessage='likes' />
          </h3>
          <IconButton
            className='compose-modal__close'
            title={intl.formatMessage(messages.close)}
            src={require('@tabler/icons/icons/x.svg')}
            onClick={this.onClickClose} size={20}
          />
        </div>
        {body}
      </div>
    );
  }

}
