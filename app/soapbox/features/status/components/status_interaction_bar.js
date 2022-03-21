import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import emojify from 'soapbox/features/emoji/emoji';
import { reduceEmoji } from 'soapbox/utils/emoji_reacts';
import { getFeatures } from 'soapbox/utils/features';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';

import { HStack, IconButton, Text } from '../../../components/ui';

const mapStateToProps = state => {
  const me = state.get('me');
  const instance = state.get('instance');

  return {
    me,
    allowedEmoji: getSoapboxConfig(state).get('allowedEmoji'),
    features: getFeatures(instance),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onOpenUnauthorizedModal() {
    dispatch(openModal('UNAUTHORIZED'));
  },
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

  handleOpenReblogsModal = (event) => {
    const { me, status, onOpenUnauthorizedModal, onOpenReblogsModal } = this.props;

    event.preventDefault();

    if (!me) onOpenUnauthorizedModal();
    else onOpenReblogsModal(status.getIn(['account', 'acct']), status.get('id'));
  }

  getReposts = () => {
    const { status } = this.props;

    if (status.get('reblogs_count')) {
      return (
        <HStack space={0.5} alignItems='center'>
          <IconButton
            className='text-success-600 cursor-pointer'
            src={require('@tabler/icons/icons/repeat.svg')}
            role='presentation'
            onClick={this.handleOpenReblogsModal}
          />

          <Text theme='muted' size='sm'>
            <FormattedNumber value={status.get('reblogs_count')} />
          </Text>
        </HStack>
      );
    }

    return '';
  }

  handleOpenFavouritesModal = (event) => {
    const { me, status, onOpenUnauthorizedModal, onOpenFavouritesModal } = this.props;

    event.preventDefault();

    if (!me) onOpenUnauthorizedModal();
    else onOpenFavouritesModal(status.getIn(['account', 'acct']), status.get('id'));
  }

  getFavourites = () => {
    const { features, status } = this.props;

    if (status.get('favourites_count')) {
      return (
        <HStack space={0.5} alignItems='center'>
          <IconButton
            className={classNames({
              'text-accent-300': true,
              'cursor-default': !features.exposableReactions,
            })}
            src={require('@tabler/icons/icons/heart.svg')}
            iconClassName='fill-accent-300'
            role='presentation'
            onClick={features.exposableReactions ? this.handleOpenFavouritesModal : null}
          />

          <Text theme='muted' size='sm'>
            <FormattedNumber value={status.get('favourites_count')} />
          </Text>
        </HStack>
      );
    }

    return '';
  }

  handleOpenReactionsModal = (reaction) => () => {
    const { me, status, onOpenUnauthorizedModal, onOpenReactionsModal } = this.props;

    if (!me) onOpenUnauthorizedModal();
    else onOpenReactionsModal(status.getIn(['account', 'acct']), status.get('id'), reaction.get('name'));
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
                  <span
                    className='emoji-react'
                    type='button'
                    role='presentation'
                    key={i}
                    onClick={this.handleOpenReactionsModal(e)}
                  >
                    {emojiReact}
                  </span>
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
      <HStack space={3}>
        {features.emojiReacts ? this.getEmojiReacts() : this.getFavourites()}

        {this.getReposts()}
      </HStack>
    );
  }

}
