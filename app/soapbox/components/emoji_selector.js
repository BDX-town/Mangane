import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import emojify from 'soapbox/features/emoji/emoji';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import classNames from 'classnames';

const mapStateToProps = state => ({
  allowedEmoji: getSoapboxConfig(state).get('allowedEmoji'),
});

export default @connect(mapStateToProps)
class EmojiSelector extends ImmutablePureComponent {

  static propTypes = {
    onReact: PropTypes.func.isRequired,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    onReact: () => {},
    visible: false,
  }

  render() {
    const { onReact, visible, allowedEmoji } = this.props;

    return (
      <div className={classNames('emoji-react-selector', { 'emoji-react-selector--visible': visible })}>
        {allowedEmoji.map((emoji, i) => (
          <button
            key={i}
            className='emoji-react-selector__emoji'
            dangerouslySetInnerHTML={{ __html: emojify(emoji) }}
            onClick={onReact(emoji)}
          />
        ))}
      </div>
    );
  }

}
