import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import IconButton from 'soapbox/components/icon_button';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

export default @injectIntl
class HotkeysModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const { intl, onClose } = this.props;

    return (
      <div className='modal-root__modal hotkeys-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'><FormattedMessage id='keyboard_shortcuts.heading' defaultMessage='Keyboard shortcuts' /></h3>
          <IconButton className='compose-modal__close' title={intl.formatMessage(messages.close)} src={require('@tabler/icons/icons/x.svg')} onClick={onClose} />
        </div>
        <div className='compose-modal__content'>
          <table>
            <thead>
              <tr>
                <th><FormattedMessage id='keyboard_shortcuts.hotkey' defaultMessage='Hotkey' /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>r</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.reply' defaultMessage='to reply' /></td>
              </tr>
              <tr>
                <td><kbd>m</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.mention' defaultMessage='to mention author' /></td>
              </tr>
              <tr>
                <td><kbd>p</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.profile' defaultMessage="to open author's profile" /></td>
              </tr>
              <tr>
                <td><kbd>f</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.favourite' defaultMessage='to like' /></td>
              </tr>
              <tr>
                <td><kbd>e</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.react' defaultMessage='to react' /></td>
              </tr>
              <tr>
                <td><kbd>b</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.boost' defaultMessage='to repost' /></td>
              </tr>
              <tr>
                <td><kbd>enter</kbd>, <kbd>o</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.enter' defaultMessage='to open post' /></td>
              </tr>
              <tr>
                <td><kbd>a</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.open_media' defaultMessage='to open media' /></td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th><FormattedMessage id='keyboard_shortcuts.hotkey' defaultMessage='Hotkey' /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>x</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.toggle_hidden' defaultMessage='to show/hide text behind CW' /></td>
              </tr>
              <tr>
                <td><kbd>h</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.toggle_sensitivity' defaultMessage='to show/hide media' /></td>
              </tr>
              <tr>
                <td><kbd>up</kbd>, <kbd>k</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.up' defaultMessage='to move up in the list' /></td>
              </tr>
              <tr>
                <td><kbd>down</kbd>, <kbd>j</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.down' defaultMessage='to move down in the list' /></td>
              </tr>
              <tr>
                <td><kbd>n</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.compose' defaultMessage='to focus the compose textarea' /></td>
              </tr>
              <tr>
                <td><kbd>alt</kbd> + <kbd>n</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.toot' defaultMessage='to start a new post' /></td>
              </tr>
              <tr>
                <td><kbd>backspace</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.back' defaultMessage='to navigate back' /></td>
              </tr>
              <tr>
                <td><kbd>s</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.search' defaultMessage='to focus search' /></td>
              </tr>
              <tr>
                <td><kbd>esc</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.unfocus' defaultMessage='to un-focus compose textarea/search' /></td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th><FormattedMessage id='keyboard_shortcuts.hotkey' defaultMessage='Hotkey' /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>g</kbd> + <kbd>h</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.home' defaultMessage='to open home timeline' /></td>
              </tr>
              <tr>
                <td><kbd>g</kbd> + <kbd>n</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.notifications' defaultMessage='to open notifications column' /></td>
              </tr>
              <tr>
                <td><kbd>g</kbd> + <kbd>f</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.favourites' defaultMessage='to open likes list' /></td>
              </tr>
              <tr>
                <td><kbd>g</kbd> + <kbd>p</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.pinned' defaultMessage='to open pinned posts list' /></td>
              </tr>
              <tr>
                <td><kbd>g</kbd> + <kbd>u</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.my_profile' defaultMessage='to open your profile' /></td>
              </tr>
              <tr>
                <td><kbd>g</kbd> + <kbd>b</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.blocked' defaultMessage='to open blocked users list' /></td>
              </tr>
              <tr>
                <td><kbd>g</kbd> + <kbd>m</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.muted' defaultMessage='to open muted users list' /></td>
              </tr>
              <tr>
                <td><kbd>g</kbd> + <kbd>r</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.requests' defaultMessage='to open follow requests list' /></td>
              </tr>
              <tr>
                <td><kbd>?</kbd></td>
                <td><FormattedMessage id='keyboard_shortcuts.legend' defaultMessage='to display this legend' /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

}
