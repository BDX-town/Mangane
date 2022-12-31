import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import React, { MouseEventHandler } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { IconButton } from 'soapbox/components/ui';
import { useTheme } from 'soapbox/hooks';
import { isMobile } from 'soapbox/is_mobile';

const messages = defineMessages({
  emoji: { id: 'emoji_button.label', defaultMessage: 'Insert emoji' },
  emoji_search: { id: 'emoji_button.search', defaultMessage: 'Search…' },
  emoji_not_found: { id: 'emoji_button.not_found', defaultMessage: 'No emoji\'s found.' },
  custom: { id: 'emoji_button.custom', defaultMessage: 'Custom' },
  recent: { id: 'emoji_button.recent', defaultMessage: 'Frequently used' },
  search_results: { id: 'emoji_button.search_results', defaultMessage: 'Search results' },
  people: { id: 'emoji_button.people', defaultMessage: 'People' },
  nature: { id: 'emoji_button.nature', defaultMessage: 'Nature' },
  food: { id: 'emoji_button.food', defaultMessage: 'Food & Drink' },
  activity: { id: 'emoji_button.activity', defaultMessage: 'Activity' },
  travel: { id: 'emoji_button.travel', defaultMessage: 'Travel & Places' },
  objects: { id: 'emoji_button.objects', defaultMessage: 'Objects' },
  symbols: { id: 'emoji_button.symbols', defaultMessage: 'Symbols' },
  flags: { id: 'emoji_button.flags', defaultMessage: 'Flags' },
  skins: { id: 'emoji_button.skins', defaultMessage: 'Skins' },
});

interface IWrapper {
    target: any,
    show: boolean,
    onClose: MouseEventHandler,
    children: React.ReactNode,
}

const Wrapper: React.FC<IWrapper> = ({ target, show, onClose, children }) => {
  if (!show) return null;
  return (
    <div className='emoji-picker fixed top-0 left-0 w-screen h-screen bg-gray-800 z-[100]'>
      <div className='bg-white dark:bg-slate-800  flex flex-col overflow-hidden sm:rounded-lg absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] '>
        <div className='p-1'>
          <IconButton
            className='ml-auto text-gray-500'
            src={require('@tabler/icons/x.svg')}
            onClick={onClose}
          />
        </div>
        { children }
      </div>
    </div>
  );
};

interface IEmojiPicker {
    custom_emojis?: ImmutableList<string>,
    button?: React.ReactNode,
    onPickEmoji: Function,
}

const EmojiPickerUI : React.FC<IEmojiPicker> = ({
  custom_emojis = ImmutableList(),
  button,
  onPickEmoji,
}) => {
  const root = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);
  const intl = useIntl();
  const theme = useTheme();

  const handleClose = React.useCallback((e = null) => {
    if (e) {
      e.stopPropagation();
    }
    setActive(false);
  }, []);

  const handleToggle = React.useCallback((e) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      setActive(false);
      return;
    }

    if ((!e.key || e.key === 'Enter')) {
      setActive(!active);
    }
  }, [active]);

  const buildCustomEmojis = React.useCallback((custom_emojis: ImmutableList<any>) => {
    const emojis = custom_emojis.map((emoji) => (
      {
        id: emoji.get('shortcode'),
        name: emoji.get('shortcode'),
        keywords: [emoji.get('shortcode')],
        skins: [{ src: emoji.get('static_url') }],
      }
    )).toJS();
    return [{
      id: 'custom',
      name: intl.formatMessage(messages.custom),
      emojis,
    }];
  }, []);

  const handlePick = React.useCallback((emoji) => {
    onPickEmoji({ ...emoji, native: emoji.native || emoji.shortcodes });
    handleClose();
  }, [handleClose, onPickEmoji]);

  return (
    <>
      <div className='relative' ref={root} onKeyDown={handleToggle}>
        <div role='button' tabIndex={0} onClick={handleToggle}>
          {
            button || <IconButton
              className={classNames({
                'text-gray-400 hover:text-gray-600': true,
              })}
              alt='😀'
              src={require('@tabler/icons/mood-happy.svg')}
            />
          }
        </div>
        <Wrapper target={root} show={active} onClose={handleClose}>
          <Picker
            theme={theme}
            dynamicWidth={isMobile(window.innerWidth)}
            categories={['frequent', 'custom', 'people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags']}
            previewPosition='none'
            custom={buildCustomEmojis(custom_emojis)}
            data={data}
            onEmojiSelect={handlePick}
            i18n={
              {
                search: intl.formatMessage(messages.emoji_search),
                notfound: intl.formatMessage(messages.emoji_not_found),
                skins: intl.formatMessage(messages.skins),
                categories: {
                  search: intl.formatMessage(messages.search_results),
                  recent: intl.formatMessage(messages.recent),
                  people: intl.formatMessage(messages.people),
                  nature: intl.formatMessage(messages.nature),
                  foods: intl.formatMessage(messages.food),
                  activity: intl.formatMessage(messages.activity),
                  places: intl.formatMessage(messages.travel),
                  objects: intl.formatMessage(messages.objects),
                  symbols: intl.formatMessage(messages.symbols),
                  flags: intl.formatMessage(messages.flags),
                  custom: intl.formatMessage(messages.custom),
                },
              }
            }
          />
        </Wrapper>
      </div>
    </>
  );
};

export default EmojiPickerUI;