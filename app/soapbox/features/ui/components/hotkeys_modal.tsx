import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';

interface IHotkeysModal {
  onClose: () => void,
}

const Hotkey: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className='px-1.5 py-1 bg-primary-50 dark:bg-slate-700 border border-solid border-primary-200 rounded-md dark:border-slate-500 text-xs font-sans'>
    {children}
  </kbd>
);

const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className='pb-3 px-2'>
    {children}
  </td>
);

const HotkeysModal: React.FC<IHotkeysModal> = ({ onClose }) => {
  const features = useAppSelector((state) => getFeatures(state.instance));

  return (
    <Modal
      title={<FormattedMessage id='keyboard_shortcuts.heading' defaultMessage='Keyboard shortcuts' />}
      onClose={onClose}
      width='4xl'
    >
      <div className='flex flex-col lg:flex-row text-xs'>
        <table>
          <thead>
            <tr>
              <th className='pb-2 font-bold'><FormattedMessage id='keyboard_shortcuts.hotkey' defaultMessage='Hotkey' /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell><Hotkey>r</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.reply' defaultMessage='to reply' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>m</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.mention' defaultMessage='to mention author' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>p</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.profile' defaultMessage="to open author's profile" /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>f</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.favourite' defaultMessage='to like' /></TableCell>
            </tr>
            {features.emojiReacts && (
              <tr>
                <TableCell><Hotkey>e</Hotkey></TableCell>
                <TableCell><FormattedMessage id='keyboard_shortcuts.react' defaultMessage='to react' /></TableCell>
              </tr>
            )}
            <tr>
              <TableCell><Hotkey>b</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.boost' defaultMessage='to repost' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>enter</Hotkey>, <Hotkey>o</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.enter' defaultMessage='to open post' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>a</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.open_media' defaultMessage='to open media' /></TableCell>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th className='pb-2 font-bold'><FormattedMessage id='keyboard_shortcuts.hotkey' defaultMessage='Hotkey' /></th>
            </tr>
          </thead>
          <tbody>
            {features.spoilers && (
              <tr>
                <TableCell><Hotkey>x</Hotkey></TableCell>
                <TableCell><FormattedMessage id='keyboard_shortcuts.toggle_hidden' defaultMessage='to show/hide text behind CW' /></TableCell>
              </tr>
            )}
            {features.spoilers && (
              <tr>
                <TableCell><Hotkey>h</Hotkey></TableCell>
                <TableCell><FormattedMessage id='keyboard_shortcuts.toggle_sensitivity' defaultMessage='to show/hide media' /></TableCell>
              </tr>
            )}
            <tr>
              <TableCell><Hotkey>up</Hotkey>, <Hotkey>k</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.up' defaultMessage='to move up in the list' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>down</Hotkey>, <Hotkey>j</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.down' defaultMessage='to move down in the list' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>n</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.compose' defaultMessage='to focus the compose textarea' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>alt</Hotkey> + <Hotkey>n</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.toot' defaultMessage='to start a new post' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>backspace</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.back' defaultMessage='to navigate back' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>s</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.search' defaultMessage='to focus search' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>esc</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.unfocus' defaultMessage='to un-focus compose textarea/search' /></TableCell>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th className='pb-2 font-bold'><FormattedMessage id='keyboard_shortcuts.hotkey' defaultMessage='Hotkey' /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell><Hotkey>g</Hotkey> + <Hotkey>h</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.home' defaultMessage='to open home timeline' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>g</Hotkey> + <Hotkey>n</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.notifications' defaultMessage='to open notifications column' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>g</Hotkey> + <Hotkey>f</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.favourites' defaultMessage='to open likes list' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>g</Hotkey> + <Hotkey>p</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.pinned' defaultMessage='to open pinned posts list' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>g</Hotkey> + <Hotkey>u</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.my_profile' defaultMessage='to open your profile' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>g</Hotkey> + <Hotkey>b</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.blocked' defaultMessage='to open blocked users list' /></TableCell>
            </tr>
            <tr>
              <TableCell><Hotkey>g</Hotkey> + <Hotkey>m</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.muted' defaultMessage='to open muted users list' /></TableCell>
            </tr>
            {features.followRequests && (
              <tr>
                <TableCell><Hotkey>g</Hotkey> + <Hotkey>r</Hotkey></TableCell>
                <TableCell><FormattedMessage id='keyboard_shortcuts.requests' defaultMessage='to open follow requests list' /></TableCell>
              </tr>
            )}
            <tr>
              <TableCell><Hotkey>?</Hotkey></TableCell>
              <TableCell><FormattedMessage id='keyboard_shortcuts.legend' defaultMessage='to display this legend' /></TableCell>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default HotkeysModal;
