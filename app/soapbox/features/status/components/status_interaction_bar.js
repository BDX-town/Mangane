import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedNumber } from 'react-intl';
import emojify from 'soapbox/features/emoji/emoji';
import { reduceEmoji } from 'soapbox/utils/emoji_reacts';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';
import { Link } from 'react-router-dom';
import Icon from 'soapbox/components/icon';

export class StatusInteractionBar extends React.Component {

  static propTypes = {
    status: ImmutablePropTypes.map,
    me: SoapboxPropTypes.me,
  }

  getNormalizedReacts = () => {
    const { status } = this.props;
    return reduceEmoji(
      status.getIn(['pleroma', 'emoji_reactions']),
      status.get('favourites_count'),
      status.get('favourited'),
    ).reverse();
  }

  getRepost = () => {
    const { status } = this.props;
    if (status.get('reblogs_count')) {
      return (
        <Link to={`/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}/reblogs`} className='emoji-react emoji-react--reblogs'>
          <Icon id='retweet' />
          <span className='emoji-reacts__count'>
            <FormattedNumber value={status.get('reblogs_count')} />
          </span>
        </Link>
      );
    }

    return '';
  }

  render() {
    const emojiReacts = this.getNormalizedReacts();
    const count = emojiReacts.reduce((acc, cur) => (
      acc + cur.get('count')
    ), 0);
    const repost = this.getRepost();

    const EmojiReactsContainer = () => (
      <div className='emoji-reacts-container'>
        <div className='emoji-reacts'>
          {emojiReacts.map((e, i) => (
            <span className='emoji-react' key={i}>
              <span
                className='emoji-react__emoji'
                dangerouslySetInnerHTML={{ __html: emojify(e.get('name')) }}
              />
              <span className='emoji-react__count'>{e.get('count')}</span>
            </span>
          ))}
        </div>
        <div className='emoji-reacts__count'>
          {count}
        </div>
      </div>
    );

    return (
      <div className='status-interaction-bar'>
        {count > 0 && <EmojiReactsContainer />}
        {repost}
      </div>
    );
  }

}
