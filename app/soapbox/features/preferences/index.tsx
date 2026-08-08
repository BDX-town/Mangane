import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changeSetting } from 'soapbox/actions/settings';
import List, { ListItem } from 'soapbox/components/list';
import { Form } from 'soapbox/components/ui';
import { SelectDropdown } from 'soapbox/features/forms';
import SettingToggle from 'soapbox/features/notifications/components/setting_toggle';
import { useFeatures, useSettings } from 'soapbox/hooks';

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

// This is temporary, need to use full range of ISO languages like here.
// https://akkoma.dev/AkkomaGang/akkoma-fe/pulls/387
const postLanguages = languages;

const messages = defineMessages({
  heading: { id: 'column.preferences', defaultMessage: 'Preferences' },
  display_media_default: { id: 'preferences.fields.display_media.default', defaultMessage: 'Hide media marked as sensitive' },
  display_media_hide_all: { id: 'preferences.fields.display_media.hide_all', defaultMessage: 'Always hide media' },
  display_media_show_all: { id: 'preferences.fields.display_media.show_all', defaultMessage: 'Always show media' },
  privacy_public: { id: 'preferences.options.privacy_public', defaultMessage: 'Public' },
  privacy_local: { id: 'preferences.options.privacy_local', defaultMessage: 'Local-only' },
  privacy_unlisted: { id: 'preferences.options.privacy_unlisted', defaultMessage: 'Unlisted' },
  privacy_followers_only: { id: 'preferences.options.privacy_followers_only', defaultMessage: 'Followers-only' },
  content_type_plaintext: { id: 'preferences.options.content_type_plaintext', defaultMessage: 'Plain text' },
  content_type_markdown: { id: 'preferences.options.content_type_markdown', defaultMessage: 'Markdown' },
});

const Preferences = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const features = useFeatures();
  const settings = useSettings();

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, path: string[]) => {
    dispatch(changeSetting(path, event.target.value, { showAlert: true }));
  };

  const onToggleChange = (key: string[], checked: boolean) => {
    dispatch(changeSetting(key, checked, { showAlert: true }));
  };

  const displayMediaOptions = React.useMemo(() => ({
    default: intl.formatMessage(messages.display_media_default),
    hide_all: intl.formatMessage(messages.display_media_hide_all),
    show_all: intl.formatMessage(messages.display_media_show_all),
  }), [intl]);

  const defaultPrivacyOptions = React.useMemo(() => ({
    public: intl.formatMessage(messages.privacy_public),
    ...(features.localOnlyPrivacy ? { local: intl.formatMessage(messages.privacy_local) } : {}),
    unlisted: intl.formatMessage(messages.privacy_unlisted),
    private: intl.formatMessage(messages.privacy_followers_only),
  }), [features.localOnlyPrivacy, intl]);

  const defaultContentTypeOptions = React.useMemo(() => ({
    'text/plain': intl.formatMessage(messages.content_type_plaintext),
    'text/markdown': intl.formatMessage(messages.content_type_markdown),
  }), [intl]);

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

        {features.privacyScopes && (
          <ListItem label={<FormattedMessage id='preferences.fields.privacy_label' defaultMessage='Default post privacy' />}>
            <SelectDropdown
              items={defaultPrivacyOptions}
              defaultValue={settings.get('defaultPrivacy') as string | undefined}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectChange(event, ['defaultPrivacy'])}
            />
          </ListItem>
        )}

        {features.richText && (
          <ListItem label={<FormattedMessage id='preferences.fields.content_type_label' defaultMessage='Default post format' />}>
            <SelectDropdown
              items={defaultContentTypeOptions}
              defaultValue={settings.get('defaultContentType') as string | undefined}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectChange(event, ['defaultContentType'])}
            />
          </ListItem>
        )}
        <ListItem label={<FormattedMessage id='preferences.fields.post_language' defaultMessage='Default post language' />}>
          <SelectDropdown
            items={postLanguages}
            defaultValue={settings.get('defaultPostLanguage') as string | undefined}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectChange(event, ['defaultPostLanguage'])}
          />
        </ListItem>
      </List>

      <List>
        <ListItem label={<FormattedMessage id='preferences.fields.boost_modal_label' defaultMessage='Show confirmation dialog before reposting' />}>
          <SettingToggle settings={settings} settingPath={['boostModal']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.delete_modal_label' defaultMessage='Show confirmation dialog before deleting a post' />}>
          <SettingToggle settings={settings} settingPath={['deleteModal']} onChange={onToggleChange} />
        </ListItem>
      </List>

      <List>
        <ListItem label={<FormattedMessage id='preferences.fields.auto_play_gif_label' defaultMessage='Auto-play animated GIFs' />}>
          <SettingToggle settings={settings} settingPath={['autoPlayGif']} onChange={onToggleChange} />
        </ListItem>

        {features.spoilers && <ListItem label={<FormattedMessage id='preferences.fields.expand_spoilers_label' defaultMessage='Always expand posts marked with content warnings' />}>
          <SettingToggle settings={settings} settingPath={['expandSpoilers']} onChange={onToggleChange} />
        </ListItem>}

        <ListItem label={<FormattedMessage id='preferences.fields.autoload_timelines_label' defaultMessage='Automatically load new posts when scrolled to the top of the page' />}>
          <SettingToggle settings={settings} settingPath={['autoloadTimelines']} onChange={onToggleChange} />
        </ListItem>
      </List>
    </Form>
  );
};

export { Preferences as default, languages, postLanguages };
