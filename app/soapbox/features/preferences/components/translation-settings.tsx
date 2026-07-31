import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changeSetting } from 'soapbox/actions/settings';
import List, { ListItem } from 'soapbox/components/list';
import { CardHeader, CardTitle, FormGroup, Input } from 'soapbox/components/ui';
import { SelectDropdown } from 'soapbox/features/forms';
import SettingToggle from 'soapbox/features/notifications/components/setting_toggle';
import { useSettings } from 'soapbox/hooks';

import { languages } from '../index';

const messages = defineMessages({
  heading: { id: 'preferences.translation.heading', defaultMessage: 'Translation' },
  providerLabel: { id: 'preferences.translation.provider', defaultMessage: 'Translation provider' },
  providerServer: { id: 'preferences.translation.provider_server', defaultMessage: 'Server (Akkoma built-in)' },
  providerDeepL: { id: 'preferences.translation.provider_deepl', defaultMessage: 'DeepL' },
  providerLibreTranslate: { id: 'preferences.translation.provider_libretranslate', defaultMessage: 'LibreTranslate' },
  targetLanguageLabel: { id: 'preferences.translation.target_language', defaultMessage: 'Translate to' },
  deeplApiKeyLabel: { id: 'preferences.translation.deepl_api_key', defaultMessage: 'DeepL API key' },
  deeplApiKeyHint: { id: 'preferences.translation.deepl_api_key_hint', defaultMessage: 'Get a free API key at deepl.com/pro-api' },
  deeplProLabel: { id: 'preferences.translation.deepl_pro', defaultMessage: 'Use DeepL Pro endpoint' },
  libreTranslateUrlLabel: { id: 'preferences.translation.libretranslate_url', defaultMessage: 'LibreTranslate URL' },
  libreTranslateUrlPlaceholder: { id: 'preferences.translation.libretranslate_url_placeholder', defaultMessage: 'https://libretranslate.com' },
  libreTranslateApiKeyLabel: { id: 'preferences.translation.libretranslate_api_key', defaultMessage: 'LibreTranslate API key (optional)' },
  autoTranslateLabel: { id: 'preferences.translation.auto_translate', defaultMessage: 'Automatically translate posts in other languages' },
  autoTranslateHint: { id: 'preferences.translation.auto_translate_hint', defaultMessage: 'Posts will be translated inline as they appear in your timeline' },
});

const TranslationSettings: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const settings = useSettings();

  const translationSettings = settings.get('translation') as any;
  const provider = translationSettings?.get('provider', 'server') as string;

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, path: string[]) => {
    dispatch(changeSetting(path, event.target.value, { showAlert: true }));
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>, path: string[]) => {
    dispatch(changeSetting(path, event.target.value, { showAlert: true }));
  };

  const onToggleChange = (key: string[], checked: boolean) => {
    dispatch(changeSetting(key, checked, { showAlert: true }));
  };

  const providerOptions = React.useMemo(() => ({
    server: intl.formatMessage(messages.providerServer),
    deepl: intl.formatMessage(messages.providerDeepL),
    libretranslate: intl.formatMessage(messages.providerLibreTranslate),
  }), [intl]);

  return (
    <>
      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.heading)} />
      </CardHeader>

      <List>
        <ListItem label={intl.formatMessage(messages.providerLabel)}>
          <SelectDropdown
            items={providerOptions}
            defaultValue={provider}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectChange(event, ['translation', 'provider'])}
          />
        </ListItem>

        <ListItem label={intl.formatMessage(messages.targetLanguageLabel)}>
          <SelectDropdown
            items={languages}
            defaultValue={translationSettings?.get('targetLanguage', settings.get('locale')) as string}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectChange(event, ['translation', 'targetLanguage'])}
          />
        </ListItem>

        <ListItem
          label={<FormattedMessage id='preferences.translation.auto_translate' defaultMessage='Automatically translate posts in other languages' />}
          hint={<FormattedMessage id='preferences.translation.auto_translate_hint' defaultMessage='Posts will be translated inline as they appear in your timeline' />}
        >
          <SettingToggle settings={settings} settingPath={['translation', 'autoTranslate']} onChange={onToggleChange} />
        </ListItem>
      </List>

      {/* DeepL settings */}
      {provider === 'deepl' && (
        <List>
          <ListItem label={intl.formatMessage(messages.deeplApiKeyLabel)}>
            <FormGroup hintText={intl.formatMessage(messages.deeplApiKeyHint)}>
              <Input
                type='password'
                autoComplete='off'
                value={translationSettings?.get('deeplApiKey', '') as string}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onInputChange(event, ['translation', 'deeplApiKey'])}
              />
            </FormGroup>
          </ListItem>

          <ListItem label={intl.formatMessage(messages.deeplProLabel)}>
            <SettingToggle settings={settings} settingPath={['translation', 'deeplPro']} onChange={onToggleChange} />
          </ListItem>
        </List>
      )}

      {/* LibreTranslate settings */}
      {provider === 'libretranslate' && (
        <List>
          <ListItem label={intl.formatMessage(messages.libreTranslateUrlLabel)}>
            <Input
              type='text'
              placeholder={intl.formatMessage(messages.libreTranslateUrlPlaceholder)}
              autoComplete='off'
              value={translationSettings?.get('libreTranslateUrl', '') as string}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onInputChange(event, ['translation', 'libreTranslateUrl'])}
            />
          </ListItem>

          <ListItem label={intl.formatMessage(messages.libreTranslateApiKeyLabel)}>
            <Input
              type='password'
              autoComplete='off'
              value={translationSettings?.get('libreTranslateApiKey', '') as string}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onInputChange(event, ['translation', 'libreTranslateApiKey'])}
            />
          </ListItem>
        </List>
      )}
    </>
  );
};

export default TranslationSettings;
