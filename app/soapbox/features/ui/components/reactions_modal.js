import React from 'react';
import { connect } from 'react-redux';
import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import IconButton from 'soapbox/components/icon_button';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import AccountContainer from 'soapbox/containers/account_container';
import ScrollableList from 'soapbox/components/scrollable_list';
import { fetchFavourites, fetchReactions } from 'soapbox/actions/interactions';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
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
        {
          reactions.size > 0 && (
            <div className='reaction__filter-bar'>
              <button className={!reaction ? 'active' : ''} onClick={this.handleFilterChange('')}>All</button>
              {reactions?.filter(reaction => reaction.count).map(reaction => <button key={reaction.name} className={this.state.reaction === reaction.name ? 'active' : ''} onClick={this.handleFilterChange(reaction.name)}>{reaction.name} {reaction.count}</button>)}
            </div>
          )
        }
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
