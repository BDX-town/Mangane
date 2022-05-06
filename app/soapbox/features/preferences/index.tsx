import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { getSettings, changeSetting } from 'soapbox/actions/settings';
import List, { ListItem } from 'soapbox/components/list';
import { Form } from 'soapbox/components/ui';
import { SelectDropdown } from 'soapbox/features/forms';
import SettingToggle from 'soapbox/features/notifications/components/setting_toggle';
import { useAppSelector } from 'soapbox/hooks';

import ThemeToggle from '../ui/components/theme-toggle';

const languages = {
  en: 'English',
  ar: 'العربية',
  ast: 'Asturianu',
  bg: 'Български',
  bn: 'বাংলা',
  ca: 'Català',
  co: 'Corsu',
  cs: 'Čeština',
  cy: 'Cymraeg',
  da: 'Dansk',
  de: 'Deutsch',
  el: 'Ελληνικά',
  'en-Shaw': '𐑖𐑱𐑝𐑾𐑯',
  eo: 'Esperanto',
  es: 'Español',
  eu: 'Euskara',
  fa: 'فارسی',
  fi: 'Suomi',
  fr: 'Français',
  ga: 'Gaeilge',
  gl: 'Galego',
  he: 'עברית',
  hi: 'हिन्दी',
  hr: 'Hrvatski',
  hu: 'Magyar',
  hy: 'Հայերեն',
  id: 'Bahasa Indonesia',
  io: 'Ido',
  is: 'íslenska',
  it: 'Italiano',
  ja: '日本語',
  ka: 'ქართული',
  kk: 'Қазақша',
  ko: '한국어',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  ml: 'മലയാളം',
  ms: 'Bahasa Melayu',
  nl: 'Nederlands',
  no: 'Norsk',
  oc: 'Occitan',
  pl: 'Polski',
  pt: 'Português',
  'pt-BR': 'Português do Brasil',
  ro: 'Română',
  ru: 'Русский',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  sq: 'Shqip',
  sr: 'Српски',
  'sr-Latn': 'Srpski (latinica)',
  sv: 'Svenska',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  th: 'ไทย',
  tr: 'Türkçe',
  uk: 'Українська',
  zh: '中文',
  'zh-CN': '简体中文',
  'zh-HK': '繁體中文（香港）',
  'zh-TW': '繁體中文（臺灣）',
};

const messages = defineMessages({
  heading: { id: 'column.preferences', defaultMessage: 'Preferences' },
  display_media_default: { id: 'preferences.fields.display_media.default', defaultMessage: 'Hide media marked as sensitive' },
  display_media_hide_all: { id: 'preferences.fields.display_media.hide_all', defaultMessage: 'Always hide media' },
  display_media_show_all: { id: 'preferences.fields.display_media.show_all', defaultMessage: 'Always show media' },
});

const Preferences = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  // const features = useAppSelector((state) => getFeatures(state.get('instance')));
  const settings = useAppSelector((state) => getSettings(state));

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, path: string[]) => {
    dispatch(changeSetting(path, event.target.value, intl));
  };

  // const onDefaultPrivacyChange = (e) => {
  //   dispatch(changeSetting(['defaultPrivacy'], e.target.value));
  // }

  // const onDefaultContentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   dispatch(changeSetting(['defaultContentType'], event.target.value));
  // };

  const onToggleChange = (key: string[], checked: boolean) => {
    dispatch(changeSetting(key, checked, intl));
  };

  const displayMediaOptions = React.useMemo(() => ({
    default: intl.formatMessage(messages.display_media_default),
    hide_all: intl.formatMessage(messages.display_media_hide_all),
    show_all: intl.formatMessage(messages.display_media_show_all),
  }), []);

  return (
    <Form>
      <List>
        <ListItem
          label={<FormattedMessage id='home.column_settings.show_reblogs' defaultMessage='Show reposts' />}
          hint={<FormattedMessage id='preferences.hints.feed' defaultMessage='In your home feed' />}
        >
          <SettingToggle settings={settings} settingPath={['home', 'shows', 'reblog']} onChange={onToggleChange} />
        </ListItem>

        <ListItem
          label={<FormattedMessage id='home.column_settings.show_replies' defaultMessage='Show replies' />}
          hint={<FormattedMessage id='preferences.hints.feed' defaultMessage='In your home feed' />}
        >
          <SettingToggle settings={settings} settingPath={['home', 'shows', 'reply']} onChange={onToggleChange} />
        </ListItem>
      </List>

      <List>
        <ListItem label={<FormattedMessage id='preferences.fields.theme' defaultMessage='Theme' />}>
          <ThemeToggle />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.language_label' defaultMessage='Language' />}>
          <SelectDropdown
            items={languages}
            defaultValue={settings.get('locale') as string | undefined}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectChange(event, ['locale'])}
          />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.media_display_label' defaultMessage='Media display' />}>
          <SelectDropdown
            items={displayMediaOptions}
            defaultValue={settings.get('displayMedia') as string | undefined}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectChange(event, ['displayMedia'])}
          />
        </ListItem>
      </List>

      {/* <FieldsGroup>
          <RadioGroup
            label={<FormattedMessage id='preferences.fields.privacy_label' defaultMessage='Post privacy' />}
            onChange={this.onDefaultPrivacyChange}
          >
            <RadioItem
              label={<FormattedMessage id='preferences.options.privacy_public' defaultMessage='Public' />}
              hint={<FormattedMessage id='preferences.hints.privacy_public' defaultMessage='Everyone can see' />}
              checked={settings.get('defaultPrivacy') === 'public'}
              value='public'
            />
            <RadioItem
              label={<FormattedMessage id='preferences.options.privacy_unlisted' defaultMessage='Unlisted' />}
              hint={<FormattedMessage id='preferences.hints.privacy_unlisted' defaultMessage='Everyone can see, but not listed on public timelines' />}
              checked={settings.get('defaultPrivacy') === 'unlisted'}
              value='unlisted'
            />
            <RadioItem
              label={<FormattedMessage id='preferences.options.privacy_followers_only' defaultMessage='Followers-only' />}
              hint={<FormattedMessage id='preferences.hints.privacy_followers_only' defaultMessage='Only show to followers' />}
              checked={settings.get('defaultPrivacy') === 'private'}
              value='private'
            />
          </RadioGroup>
        </FieldsGroup> */}

      {/* {features.richText && (
        <FieldsGroup>
          <RadioGroup
            label={<FormattedMessage id='preferences.fields.content_type_label' defaultMessage='Post format' />}
            onChange={onDefaultContentTypeChange}
          >
            <RadioItem
              label={<FormattedMessage id='preferences.options.content_type_plaintext' defaultMessage='Plain text' />}
              checked={settings.get('defaultContentType') === 'text/plain'}
              value='text/plain'
            />
            <RadioItem
              label={<FormattedMessage id='preferences.options.content_type_markdown' defaultMessage='Markdown' />}
              hint={<FormattedMessage id='preferences.hints.content_type_markdown' defaultMessage='Warning: experimental!' />}
              checked={settings.get('defaultContentType') === 'text/markdown'}
              value='text/markdown'
            />
          </RadioGroup>
        </FieldsGroup>
      )} */}

      <List>
        {/* <ListItem label={<FormattedMessage id='preferences.fields.unfollow_modal_label' defaultMessage='Show confirmation dialog before unfollowing someone' />}>
          <SettingToggle settings={settings} settingPath={['unfollowModal']} onChange={onToggleChange} />
        </ListItem> */}

        <ListItem label={<FormattedMessage id='preferences.fields.boost_modal_label' defaultMessage='Show confirmation dialog before reposting' />}>
          <SettingToggle settings={settings} settingPath={['boostModal']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.delete_modal_label' defaultMessage='Show confirmation dialog before deleting a post' />}>
          <SettingToggle settings={settings} settingPath={['deleteModal']} onChange={onToggleChange} />
        </ListItem>

        {/* <SettingsCheckbox
            label={<FormattedMessage id='preferences.fields.missing_description_modal_label' defaultMessage='Show confirmation dialog before sending a post without media descriptions' />}
            path={['missingDescriptionModal']}
          /> */}
      </List>

      <List>
        <ListItem label={<FormattedMessage id='preferences.fields.auto_play_gif_label' defaultMessage='Auto-play animated GIFs' />}>
          <SettingToggle settings={settings} settingPath={['autoPlayGif']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.expand_spoilers_label' defaultMessage='Always expand posts marked with content warnings' />}>
          <SettingToggle settings={settings} settingPath={['expandSpoilers']} onChange={onToggleChange} />
        </ListItem>

        {/* <ListItem label={<FormattedMessage id='preferences.fields.reduce_motion_label' defaultMessage='Reduce motion in animations' />}>
          <SettingToggle settings={settings} settingPath={['reduceMotion']} onChange={onToggleChange} />
        </ListItem> */}

        <ListItem label={<FormattedMessage id='preferences.fields.autoload_timelines_label' defaultMessage='Automatically load new posts when scrolled to the top of the page' />}>
          <SettingToggle settings={settings} settingPath={['autoloadTimelines']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.autoload_more_label' defaultMessage='Automatically load more items when scrolled to the bottom of the page' />}>
          <SettingToggle settings={settings} settingPath={['autoloadMore']} onChange={onToggleChange} />
        </ListItem>

        {/* <ListItem label={<FormattedMessage id='preferences.fields.underline_links_label' defaultMessage='Always underline links in posts' />}>
          <SettingToggle settings={settings} settingPath={['underlineLinks']} onChange={onToggleChange} />
        </ListItem> */}

        {/* <ListItem label={<FormattedMessage id='preferences.fields.system_font_label' defaultMessage="Use system's default font" />}>
          <SettingToggle settings={settings} settingPath={['systemFont']} onChange={onToggleChange} />
        </ListItem> */}

        {/* <div className='dyslexic'>
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.dyslexic_font_label' defaultMessage='Dyslexic mode' />}
              path={['dyslexicFont']}
            />
          </div> */}
        {/* <SettingsCheckbox
            label={<FormattedMessage id='preferences.fields.halloween_label' defaultMessage='Halloween mode' />}
            hint={<FormattedMessage id='preferences.hints.halloween' defaultMessage='Beware: SPOOKY! Supports light/dark toggle.' />}
            path={['halloween']}
          /> */}
        {/* <ListItem
          label={<FormattedMessage id='preferences.fields.demetricator_label' defaultMessage='Use Demetricator' />}
          hint={<FormattedMessage id='preferences.hints.demetricator' defaultMessage='Decrease social media anxiety by hiding all numbers from the site.' />}
        >
          <SettingToggle settings={settings} settingPath={['demetricator']} onChange={onToggleChange} />
        </ListItem> */}
      </List>
    </Form>
  );
};

export { Preferences as default, languages };
