import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { getSettings, changeSetting } from 'soapbox/actions/settings';
import Column from '../ui/components/column';
import {
  SimpleForm,
  FieldsGroup,
  RadioGroup,
  RadioItem,
  SelectDropdown,
} from 'soapbox/features/forms';
import SettingsCheckbox from 'soapbox/components/settings_checkbox';

export const languages = {
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

const mapStateToProps = state => ({
  settings: getSettings(state),
});

export default @connect(mapStateToProps)
@injectIntl
class Preferences extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    settings: ImmutablePropTypes.map,
  };

  onSelectChange = path => {
    return e => {
      this.props.dispatch(changeSetting(path, e.target.value));
    };
  };

  onDefaultPrivacyChange = e => {
    const { dispatch } = this.props;
    dispatch(changeSetting(['defaultPrivacy'], e.target.value));
  }

  onDefaultContentTypeChange = e => {
    const { dispatch } = this.props;
    dispatch(changeSetting(['defaultContentType'], e.target.value));
  }

  render() {
    const { settings, intl } = this.props;

    const displayMediaOptions = {
      default: intl.formatMessage(messages.display_media_default),
      hide_all: intl.formatMessage(messages.display_media_hide_all),
      show_all: intl.formatMessage(messages.display_media_show_all),
    };

    return (
      <Column icon='cog' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm>
          <FieldsGroup>
            <SelectDropdown
              label={<FormattedMessage id='preferences.fields.language_label' defaultMessage='Language' />}
              items={languages}
              defaultValue={settings.get('locale')}
              onChange={this.onSelectChange(['locale'])}
            />
          </FieldsGroup>

          <FieldsGroup>
            <SelectDropdown
              label={<FormattedMessage id='preferences.fields.media_display_label' defaultMessage='Media display' />}
              items={displayMediaOptions}
              defaultValue={settings.get('displayMedia')}
              onChange={this.onSelectChange(['displayMedia'])}
            />
          </FieldsGroup>

          <FieldsGroup>
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
          </FieldsGroup>

          <FieldsGroup>
            <RadioGroup
              label={<FormattedMessage id='preferences.fields.content_type_label' defaultMessage='Post format' />}
              onChange={this.onDefaultContentTypeChange}
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

          <FieldsGroup>
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.unfollow_modal_label' defaultMessage='Show confirmation dialog before unfollowing someone' />}
              path={['unfollowModal']}
            />
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.boost_modal_label' defaultMessage='Show confirmation dialog before reposting' />}
              path={['boostModal']}
            />
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.delete_modal_label' defaultMessage='Show confirmation dialog before deleting a post' />}
              path={['deleteModal']}
            />
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.missing_description_modal_label' defaultMessage='Show confirmation dialog before sending a post without media descriptions' />}
              path={['missingDescriptionModal']}
            />
          </FieldsGroup>

          <FieldsGroup>
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.auto_play_gif_label' defaultMessage='Auto-play animated GIFs' />}
              path={['autoPlayGif']}
            />
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.expand_spoilers_label' defaultMessage='Always expand posts marked with content warnings' />}
              path={['expandSpoilers']}
            />
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.reduce_motion_label' defaultMessage='Reduce motion in animations' />}
              path={['reduceMotion']}
            />
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.underline_links_label' defaultMessage='Always underline links in posts' />}
              path={['underlineLinks']}
            />
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.system_font_label' defaultMessage="Use system's default font" />}
              path={['systemFont']}
            />
            <div className='dyslexic'>
              <SettingsCheckbox
                label={<FormattedMessage id='preferences.fields.dyslexic_font_label' defaultMessage='Dyslexic mode' />}
                path={['dyslexicFont']}
              />
            </div>
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.halloween_label' defaultMessage='Halloween mode' />}
              hint={<FormattedMessage id='preferences.hints.halloween' defaultMessage='Beware: SPOOKY! Supports light/dark toggle.' />}
              path={['halloween']}
            />
            <SettingsCheckbox
              label={<FormattedMessage id='preferences.fields.demetricator_label' defaultMessage='Use Demetricator' />}
              hint={<FormattedMessage id='preferences.hints.demetricator' defaultMessage='Decrease social media anxiety by hiding all numbers from the site.' />}
              path={['demetricator']}
            />
          </FieldsGroup>
        </SimpleForm>
      </Column>
    );
  }

}
