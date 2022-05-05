import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import React, { useState, useEffect, useMemo } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { updateConfig } from 'soapbox/actions/admin';
import { uploadMedia } from 'soapbox/actions/media';
import snackbar from 'soapbox/actions/snackbar';
import { Column, Form, FormActions, FormGroup, Input, Button } from 'soapbox/components/ui';
import HStack from 'soapbox/components/ui/hstack/hstack';
import Stack from 'soapbox/components/ui/stack/stack';
import Streamfield from 'soapbox/components/ui/streamfield/streamfield';
import {
  SimpleTextarea,
  FileChooserLogo,
  Checkbox,
} from 'soapbox/features/forms';
import ThemeToggle from 'soapbox/features/ui/components/theme-toggle';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { normalizeSoapboxConfig } from 'soapbox/normalizers';

import Accordion from '../ui/components/accordion';

import ColorWithPicker from './components/color-with-picker';
import CryptoAddressInput from './components/crypto-address-input';
import FooterLinkInput from './components/footer-link-input';
import PromoPanelInput from './components/promo-panel-input';
import SitePreview from './components/site-preview';

import type { ColorChangeHandler, ColorResult } from 'react-color';

const messages = defineMessages({
  heading: { id: 'column.soapbox_config', defaultMessage: 'Soapbox config' },
  saved: { id: 'soapbox_config.saved', defaultMessage: 'Soapbox config saved!' },
  copyrightFooterLabel: { id: 'soapbox_config.copyright_footer.meta_fields.label_placeholder', defaultMessage: 'Copyright footer' },
  cryptoDonatePanelLimitLabel: { id: 'soapbox_config.crypto_donate_panel_limit.meta_fields.limit_placeholder', defaultMessage: 'Number of items to display in the crypto homepage widget' },
  customCssLabel: { id: 'soapbox_config.custom_css.meta_fields.url_placeholder', defaultMessage: 'URL' },
  rawJSONLabel: { id: 'soapbox_config.raw_json_label', defaultMessage: 'Advanced: Edit raw JSON data' },
  rawJSONHint: { id: 'soapbox_config.raw_json_hint', defaultMessage: 'Edit the settings data directly. Changes made directly to the JSON file will override the form fields above. Click "Save" to apply your changes.' },
  verifiedCanEditNameLabel: { id: 'soapbox_config.verified_can_edit_name_label', defaultMessage: 'Allow verified users to edit their own display name.' },
  displayFqnLabel: { id: 'soapbox_config.display_fqn_label', defaultMessage: 'Display domain (eg @user@domain) for local accounts.' },
  greentextLabel: { id: 'soapbox_config.greentext_label', defaultMessage: 'Enable greentext support' },
  promoPanelIconsLink: { id: 'soapbox_config.hints.promo_panel_icons.link', defaultMessage: 'Soapbox Icons List' },
  authenticatedProfileLabel: { id: 'soapbox_config.authenticated_profile_label', defaultMessage: 'Profiles require authentication' },
  authenticatedProfileHint: { id: 'soapbox_config.authenticated_profile_hint', defaultMessage: 'Users must be logged-in to view replies and media on user profiles.' },
  singleUserModeLabel: { id: 'soapbox_config.single_user_mode_label', defaultMessage: 'Single user mode' },
  singleUserModeHint: { id: 'soapbox_config.single_user_mode_hint', defaultMessage: 'Front page will redirect to a given user profile.' },
  singleUserModeProfileLabel: { id: 'soapbox_config.single_user_mode_profile_label', defaultMessage: 'Main user handle' },
  singleUserModeProfileHint: { id: 'soapbox_config.single_user_mode_profile_hint', defaultMessage: '@handle' },
});

type ValueGetter<T = Element> = (e: React.ChangeEvent<T>) => any;
type ColorValueGetter = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => any;
type Template = ImmutableMap<string, any>;
type ConfigPath = Array<string | number>;

const templates: Record<string, Template> = {
  promoPanelItem: ImmutableMap({ icon: '', text: '', url: '' }),
  footerItem: ImmutableMap({ title: '', url: '' }),
  cryptoAddress: ImmutableMap({ ticker: '', address: '', note: '' }),
};

const SoapboxConfig: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const initialData = useAppSelector(state => state.soapbox);

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(initialData);
  const [jsonEditorExpanded, setJsonEditorExpanded] = useState(false);
  const [rawJSON, setRawJSON] = useState<string>(JSON.stringify(initialData, null, 2));
  const [jsonValid, setJsonValid] = useState(true);

  const soapbox = useMemo(() => {
    return normalizeSoapboxConfig(data);
  }, [data]);

  const setConfig = (path: ConfigPath, value: any) => {
    const newData = data.setIn(path, value);
    setData(newData);
    setJsonValid(true);
  };

  const putConfig = (newData: any) => {
    setData(newData);
    setJsonValid(true);
  };

  const getParams = () => {
    return [{
      group: ':pleroma',
      key: ':frontend_configurations',
      value: [{
        tuple: [':soapbox_fe', data.toJS()],
      }],
    }];
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    dispatch(updateConfig(getParams())).then(() => {
      setLoading(false);
      dispatch(snackbar.success(intl.formatMessage(messages.saved)));
    }).catch(() => {
      setLoading(false);
    });
    setLoading(true);
    e.preventDefault();
  };

  const handleChange = (path: ConfigPath, getValue: ValueGetter<any>): React.ChangeEventHandler => {
    return e => {
      setConfig(path, getValue(e));
    };
  };

  const handleColorChange = (path: ConfigPath, getValue: ColorValueGetter): ColorChangeHandler => {
    return (color, event) => {
      setConfig(path, getValue(color, event));
    };
  };

  const handleFileChange = (path: ConfigPath): React.ChangeEventHandler<HTMLInputElement> => {
    return e => {
      const data = new FormData();
      const file = e.target.files?.item(0);

      if (file) {
        data.append('file', file);

        dispatch(uploadMedia(data)).then(({ data }: any) => {
          handleChange(path, () => data.url)(e);
        }).catch(console.error);
      }
    };
  };

  const handleStreamItemChange = (path: ConfigPath) => {
    return (values: any[]) => {
      setConfig(path, ImmutableList(values));
    };
  };

  const addStreamItem = (path: ConfigPath, template: Template) => {
    return () => {
      const items = data.getIn(path);
      setConfig(path, items.push(template));
    };
  };

  const deleteStreamItem = (path: ConfigPath) => {
    return (i: number) => {
      const newData = data.deleteIn([...path, i]);
      setData(newData);
    };
  };

  const handleEditJSON: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    setRawJSON(e.target.value);
  };

  const toggleJSONEditor = (expanded: boolean) => setJsonEditorExpanded(expanded);

  useEffect(() => {
    putConfig(initialData);
  }, [initialData]);

  useEffect(() => {
    setRawJSON(JSON.stringify(data, null, 2));
  }, [data]);

  useEffect(() => {
    try {
      const data = fromJS(JSON.parse(rawJSON));
      putConfig(data);
    } catch {
      setJsonValid(false);
    }
  }, [rawJSON]);

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <Form onSubmit={handleSubmit} className='simple_form space-y-4'>
        <fieldset className='space-y-6' disabled={isLoading}>
          <SitePreview soapbox={soapbox} />

          <HStack space={2}>
            <Stack space={2} className='w-1/2'>
              <ColorWithPicker
                buttonId='brand_color'
                label={<FormattedMessage id='soapbox_config.fields.brand_color_label' defaultMessage='Brand color' />}
                value={soapbox.brandColor}
                onChange={handleColorChange(['brandColor'], (color) => color.hex)}
              />
              <ColorWithPicker
                buttonId='accent_color'
                label={<FormattedMessage id='soapbox_config.fields.accent_color_label' defaultMessage='Accent color' />}
                value={soapbox.accentColor}
                onChange={handleColorChange(['accentColor'], (color) => color.hex)}
              />
              <div className='input with_label toggle'>
                <div className='label_input'>
                  <label><FormattedMessage id='soapbox_config.fields.theme_label' defaultMessage='Default theme' /></label>
                  <ThemeToggle />
                  {/* <ThemeToggle
                    onToggle={handleChange(['defaultSettings', 'themeMode'], value => value)}
                    themeMode={soapbox.defaultSettings.get('themeMode')}
                    intl={intl}
                  /> */}
                </div>
              </div>
            </Stack>

            <Stack className='w-1/2'>
              <FileChooserLogo
                label={<FormattedMessage id='soapbox_config.fields.logo_label' defaultMessage='Logo' />}
                name='logo'
                hint={<FormattedMessage id='soapbox_config.hints.logo' defaultMessage='SVG. At most 2 MB. Will be displayed to 50px height, maintaining aspect ratio' />}
                onChange={handleFileChange(['logo'])}
              />
            </Stack>
          </HStack>

          <FormGroup labelText={intl.formatMessage(messages.copyrightFooterLabel)}>
            <Input
              type='text'
              placeholder={intl.formatMessage(messages.copyrightFooterLabel)}
              value={soapbox.copyright}
              onChange={handleChange(['copyright'], (e) => e.target.value)}
            />
          </FormGroup>

          <Stack space={2}>
            <Checkbox
              name='verifiedCanEditName'
              label={intl.formatMessage(messages.verifiedCanEditNameLabel)}
              checked={soapbox.verifiedCanEditName === true}
              onChange={handleChange(['verifiedCanEditName'], (e) => e.target.checked)}
            />
            <Checkbox
              name='displayFqn'
              label={intl.formatMessage(messages.displayFqnLabel)}
              checked={soapbox.displayFqn === true}
              onChange={handleChange(['displayFqn'], (e) => e.target.checked)}
            />
            <Checkbox
              name='greentext'
              label={intl.formatMessage(messages.greentextLabel)}
              checked={soapbox.greentext === true}
              onChange={handleChange(['greentext'], (e) => e.target.checked)}
            />
            <Checkbox
              name='authenticatedProfile'
              label={intl.formatMessage(messages.authenticatedProfileLabel)}
              hint={intl.formatMessage(messages.authenticatedProfileHint)}
              checked={soapbox.authenticatedProfile === true}
              onChange={handleChange(['authenticatedProfile'], (e) => e.target.checked)}
            />
            <Checkbox
              name='singleUserMode'
              label={intl.formatMessage(messages.singleUserModeLabel)}
              hint={intl.formatMessage(messages.singleUserModeHint)}
              checked={soapbox.singleUserMode === true}
              onChange={handleChange(['singleUserMode'], (e) => e.target.checked)}
            />
            {soapbox.get('singleUserMode') && (
              <FormGroup labelText={intl.formatMessage(messages.singleUserModeProfileLabel)}>
                <Input
                  type='text'
                  placeholder={intl.formatMessage(messages.singleUserModeProfileHint)}
                  value={soapbox.singleUserModeProfile}
                  onChange={handleChange(['singleUserModeProfile'], (e) => e.target.value)}
                />
              </FormGroup>
            )}
          </Stack>

          <Streamfield
            label={<FormattedMessage id='soapbox_config.fields.promo_panel_fields_label' defaultMessage='Promo panel items' />}
            hint={<FormattedMessage id='soapbox_config.hints.promo_panel_fields' defaultMessage='You can have custom defined links displayed on the right panel of the timelines page.' />}
            component={PromoPanelInput}
            values={soapbox.promoPanel.items.toArray()}
            onChange={handleStreamItemChange(['promoPanel', 'items'])}
            onAddItem={addStreamItem(['promoPanel', 'items'], templates.promoPanel)}
            onRemoveItem={deleteStreamItem(['promoPanel', 'items'])}
          />

          <Streamfield
            label={<FormattedMessage id='soapbox_config.fields.home_footer_fields_label' defaultMessage='Home footer items' />}
            hint={<FormattedMessage id='soapbox_config.hints.home_footer_fields' defaultMessage='You can have custom defined links displayed on the footer of your static pages' />}
            component={FooterLinkInput}
            values={soapbox.navlinks.get('homeFooter')?.toArray() || []}
            onChange={handleStreamItemChange(['navlinks', 'homeFooter'])}
            onAddItem={addStreamItem(['navlinks', 'homeFooter'], templates.footerItem)}
            onRemoveItem={deleteStreamItem(['navlinks', 'homeFooter'])}
          />

          <Streamfield
            label={<FormattedMessage id='soapbox_config.fields.crypto_addresses_label' defaultMessage='Cryptocurrency addresses' />}
            hint={<FormattedMessage id='soapbox_config.hints.crypto_addresses' defaultMessage='Add cryptocurrency addresses so users of your site can donate to you. Order matters, and you must use lowercase ticker values.' />}
            component={CryptoAddressInput}
            values={soapbox.cryptoAddresses.toArray()}
            onChange={handleStreamItemChange(['cryptoAddresses'])}
            onAddItem={addStreamItem(['cryptoAddresses'], templates.cryptoAddress)}
            onRemoveItem={deleteStreamItem(['cryptoAddresses'])}
          />

          <FormGroup labelText={intl.formatMessage(messages.cryptoDonatePanelLimitLabel)}>
            <Input
              type='number'
              min={0}
              pattern='[0-9]+'
              placeholder={intl.formatMessage(messages.cryptoDonatePanelLimitLabel)}
              value={soapbox.cryptoDonatePanel.get('limit')}
              onChange={handleChange(['cryptoDonatePanel', 'limit'], (e) => Number(e.target.value))}
            />
          </FormGroup>

          <Accordion
            headline={intl.formatMessage(messages.rawJSONLabel)}
            expanded={jsonEditorExpanded}
            onToggle={toggleJSONEditor}
          >
            <div className={jsonValid ? 'code-editor' : 'code-editor code-editor--invalid'}>
              <SimpleTextarea
                hint={intl.formatMessage(messages.rawJSONHint)}
                value={rawJSON}
                onChange={handleEditJSON}
                rows={12}
              />
            </div>
          </Accordion>
        </fieldset>
        <FormActions>
          <Button type='submit'>
            <FormattedMessage id='soapbox_config.save' defaultMessage='Save' />
          </Button>
        </FormActions>
      </Form>
    </Column>
  );
};

export default SoapboxConfig;
