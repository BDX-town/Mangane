import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import { fetchFavourites, fetchReactions } from 'soapbox/actions/interactions';
import FilterBar from 'soapbox/components/filter_bar';
import IconButton from 'soapbox/components/icon_button';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import ScrollableList from 'soapbox/components/scrollable_list';
import AccountContainer from 'soapbox/containers/account_container';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  all: { id: 'reactions.all', defaultMessage: 'All' },
});

const mapStateToProps = (state, props) => {

  const favourites = state.getIn(['user_lists', 'favourited_by', props.statusId]);
  const reactions = state.getIn(['user_lists', 'reactions', props.statusId]);
  const allReactions = favourites && reactions && ImmutableList(favourites ? [{ accounts: favourites, count: favourites.size, name: '👍' }] : []).concat(reactions || []);

  return {
    reactions: allReactions,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ReactionsModal extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    statusId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    reaction: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    reactions: ImmutablePropTypes.list,
  };

  state = {
    reaction: this.props.reaction,
  }

  fetchData = () => {
    const { dispatch, statusId } = this.props;

    dispatch(fetchFavourites(statusId));
    dispatch(fetchReactions(statusId));
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
    this.props.onClose('REACTIONS', noPop);
  };

  handleFilterChange = (reaction) => () => {
    this.setState({ reaction });
  };

  renderFilterBar() {
    const { intl, reactions } = this.props;
    const { reaction } = this.state;

    const items = [
      {
        text: intl.formatMessage(messages.all),
        action: this.handleFilterChange(''),
        name: 'all',
      },
    ];

    reactions.forEach(reaction => items.push(
      {
        text: `${reaction.name} ${reaction.count}`,
        action: this.handleFilterChange(reaction.name),
        name: reaction.name,
      },
    ));

    return <FilterBar className='reaction__filter-bar' items={items} active={reaction || 'all'} />;
  }

  render() {
    const { intl, reactions } = this.props;
    const { reaction } = this.state;

    const accounts = reactions && (reaction
      ? reactions.find(reaction => reaction.name === this.state.reaction).accounts.map(account => ({ id: account, reaction: this.state.reaction }))
      : reactions.map(reaction => reaction.accounts.map(account => ({ id: account, reaction: reaction.name }))).flatten());

    let body;

    if (!accounts) {
      body = <LoadingIndicator />;
    } else {
      const emptyMessage = <FormattedMessage id='status.reactions.empty' defaultMessage='No one has reacted to this post yet. When someone does, they will show up here.' />;

      body = (<>
        {reactions.size > 0 && this.renderFilterBar()}
        <ScrollableList
          scrollKey='reactions'
          emptyMessage={emptyMessage}
        >
          {accounts.map((account) =>
            <AccountContainer key={`${account.id}-${account.reaction}`} id={account.id} withNote={false} reaction={account.reaction} />,
          )}
        </ScrollableList>
      </>);
    }


    return (
      <div className='modal-root__modal reactions-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'>
            <FormattedMessage id='column.reactions' defaultMessage='Reactions' />
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
