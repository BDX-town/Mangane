import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { FormattedNumber } from 'react-intl';
import emojify from 'soapbox/features/emoji/emoji';
import { reduceEmoji } from 'soapbox/utils/emoji_reacts';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';
import { getFeatures } from 'soapbox/utils/features';
import Icon from 'soapbox/components/icon';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { openModal } from 'soapbox/actions/modal';

const mapStateToProps = state => {
  const instance = state.get('instance');

  return {
    allowedEmoji: getSoapboxConfig(state).get('allowedEmoji'),
    features: getFeatures(instance),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onOpenReblogsModal(username, statusId) {
    dispatch(openModal('REBLOGS', {
      username,
      statusId,
    }));
  },
  onOpenFavouritesModal(username, statusId) {
    dispatch(openModal('FAVOURITES', {
      username,
      statusId,
    }));
  },
  onOpenReactionsModal(username, statusId, reaction) {
    dispatch(openModal('REACTIONS', {
      username,
      statusId,
      reaction,
    }));
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
class StatusInteractionBar extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    me: SoapboxPropTypes.me,
    allowedEmoji: ImmutablePropTypes.list,
    features: PropTypes.object.isRequired,
    onOpenReblogsModal: PropTypes.func,
    onOpenReactionsModal: PropTypes.func,
  }

  getNormalizedReacts = () => {
    const { status } = this.props;
    return reduceEmoji(
      status.getIn(['pleroma', 'emoji_reactions']),
      status.get('favourites_count'),
      status.get('favourited'),
      this.props.allowedEmoji,
    ).reverse();
  }

  handleOpenReblogsModal = () => {
    const { status, onOpenReblogsModal } = this.props;

    onOpenReblogsModal(status.getIn(['account', 'acct']), status.get('id'));
  }

  getReposts = () => {
    const { status } = this.props;

    if (status.get('reblogs_count')) {
      return (
        <a
          href='#'
          className='emoji-react emoji-react--reblogs'
          onClick={this.handleOpenReblogsModal}
        >
          <Icon src={require('feather-icons/dist/icons/repeat.svg')} />
          <span className='emoji-reacts__count'>
            <FormattedNumber value={status.get('reblogs_count')} />
          </span>
        </a>
      );
    }

    return '';
  }

  handleOpenFavouritesModal = () => {
    const { status, onOpenFavouritesModal } = this.props;

    onOpenFavouritesModal(status.getIn(['account', 'acct']), status.get('id'));
  }

  getFavourites = () => {
    const { features, status } = this.props;

    if (status.get('favourites_count')) {
      const favourites = (
        <>
          <Icon src={require('@tabler/icons/icons/thumb-up.svg')} />
          <span className='emoji-reacts__count'>
            <FormattedNumber value={status.get('favourites_count')} />
          </span>
        </>
      );

      if (features.exposableReactions) {
        return (
          <a
            href='#'
            className='emoji-react emoji-react--favourites'
            onClick={this.handleOpenFavouritesModal}
          >
            {favourites}
          </a>
        );
      } else {
        return (
          <div className='emoji-react emoji-react--favourites'>
            {favourites}
          </div>
        );
      }
    }

    return '';
  }

  handleOpenReactionsModal = (reaction) => () => {
    const { status, onOpenReactionsModal } = this.props;

    onOpenReactionsModal(status.getIn(['account', 'acct']), status.get('id'), reaction.get('name'));
  }

  getEmojiReacts = () => {
    const { features } = this.props;

    const emojiReacts = this.getNormalizedReacts();
    const count = emojiReacts.reduce((acc, cur) => (
      acc + cur.get('count')
    ), 0);

    if (count > 0) {
      return (
        <div className='emoji-reacts-container'>
          <div className='emoji-reacts'>
            {emojiReacts.map((e, i) => {
              const emojiReact = (
                <>
                  <span
                    className='emoji-react__emoji'
                    dangerouslySetInnerHTML={{ __html: emojify(e.get('name')) }}
                  />
                  <span className='emoji-react__count'>{e.get('count')}</span>
                </>
              );

              if (features.exposableReactions) {
                return (
                  <a
                    href='#'
                    className='emoji-react'
                    key={i}
                    onClick={this.handleOpenReactionsModal(e)}
                  >
                    {emojiReact}
                  </a>
                );
              }

              return <span className='emoji-react' key={i}>{emojiReact}</span>;
            })}
          </div>
          <div className='emoji-reacts__count'>
            {count}
          </div>
        </div>
      );
    }

    return '';
  };

  render() {
    const { features } = this.props;

    return (
      <div className='status-interaction-bar'>
        {features.emojiReacts ? this.getEmojiReacts() : this.getFavourites()}
        {this.getReposts()}
      </div>
    );
  }

}
