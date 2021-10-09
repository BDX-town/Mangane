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
import { Link } from 'react-router-dom';
import Icon from 'soapbox/components/icon';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';

const mapStateToProps = state => {
  const instance = state.get('instance');

  return {
    allowedEmoji: getSoapboxConfig(state).get('allowedEmoji'),
    features: getFeatures(instance),
  };
};

export default @connect(mapStateToProps)
class StatusInteractionBar extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    me: SoapboxPropTypes.me,
    allowedEmoji: ImmutablePropTypes.list,
    features: PropTypes.object.isRequired,
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

  getReposts = () => {
    const { status } = this.props;
    if (status.get('reblogs_count')) {
      return (
        <Link to={`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}/reblogs`} className='emoji-react emoji-react--reblogs'>
          <Icon src={require('feather-icons/dist/icons/repeat.svg')} />
          <span className='emoji-reacts__count'>
            <FormattedNumber value={status.get('reblogs_count')} />
          </span>
        </Link>
      );
    }

    return '';
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
          <Link to={`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}/likes`} className='emoji-react emoji-react--favourites'>
            {favourites}
          </Link>
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

  getEmojiReacts = () => {
    const { status, features } = this.props;

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
                return <Link to={`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}/reactions/${e.get('name')}`} className='emoji-react' key={i}>{emojiReact}</Link>;
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
