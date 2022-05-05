import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import React, { useState, useEffect, useMemo } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { updateConfig } from 'soapbox/actions/admin';
import { uploadMedia } from 'soapbox/actions/media';
import snackbar from 'soapbox/actions/snackbar';
import Icon from 'soapbox/components/icon';
import { Column } from 'soapbox/components/ui';
import {
  SimpleForm,
  FieldsGroup,
  TextInput,
  SimpleInput,
  SimpleTextarea,
  FileChooserLogo,
  Checkbox,
} from 'soapbox/features/forms';
import ThemeToggle from 'soapbox/features/ui/components/theme-toggle';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { normalizeSoapboxConfig } from 'soapbox/normalizers';

import Accordion from '../ui/components/accordion';

import ColorWithPicker from './components/color-with-picker';
import IconPicker from './components/icon-picker';
import SitePreview from './components/site-preview';

import type { ColorChangeHandler, ColorResult } from 'react-color';

const messages = defineMessages({
  heading: { id: 'column.soapbox_config', defaultMessage: 'Soapbox config' },
  saved: { id: 'soapbox_config.saved', defaultMessage: 'Soapbox config saved!' },
  copyrightFooterLabel: { id: 'soapbox_config.copyright_footer.meta_fields.label_placeholder', defaultMessage: 'Copyright footer' },
  promoItemIcon: { id: 'soapbox_config.promo_panel.meta_fields.icon_placeholder', defaultMessage: 'Icon' },
  promoItemLabel: { id: 'soapbox_config.promo_panel.meta_fields.label_placeholder', defaultMessage: 'Label' },
  promoItemURL: { id: 'soapbox_config.promo_panel.meta_fields.url_placeholder', defaultMessage: 'URL' },
  homeFooterItemLabel: { id: 'soapbox_config.home_footer.meta_fields.label_placeholder', defaultMessage: 'Label' },
  homeFooterItemURL: { id: 'soapbox_config.home_footer.meta_fields.url_placeholder', defaultMessage: 'URL' },
  cryptoAdressItemTicker: { id: 'soapbox_config.crypto_address.meta_fields.ticker_placeholder', defaultMessage: 'Ticker' },
  cryptoAdressItemAddress: { id: 'soapbox_config.crypto_address.meta_fields.address_placeholder', defaultMessage: 'Address' },
  cryptoAdressItemNote: { id: 'soapbox_config.crypto_address.meta_fields.note_placeholder', defaultMessage: 'Note (optional)' },
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

  const handleAddItem = (path: ConfigPath, template: ImmutableMap<string, any>) => {
    const value = (soapbox.getIn(path) || ImmutableList()) as ImmutableList<any>;

    return () => {
      setConfig(
        path,
        value.push(template),
      );
    };
  };

  const handleDeleteItem = (path: ConfigPath) => {
    return () => {
      const newData = data.deleteIn(path);
      setData(newData);
    };
  };

  const handleItemChange = (
    path: Array<string | number>,
    key: string,
    field: ImmutableMap<string, any>,
    template: Template,
    getValue: ValueGetter<HTMLInputElement> = e => e.target.value,
  ) => {
    return handleChange(
      path, (e) =>
        template
          .merge(field)
          .set(key, getValue(e)),
    );
  };

  const handlePromoItemChange = (index: number, key: string, field: any, getValue?: ValueGetter) => {
    return handleItemChange(
      ['promoPanel', 'items', index], key, field, templates.promoPanelItem, getValue,
    );
  };

  const handleHomeFooterItemChange = (index: number, key: string, field: any, getValue?: ValueGetter) => {
    return handleItemChange(
      ['navlinks', 'homeFooter', index], key, field, templates.footerItem, getValue,
    );
  };

  const handleCryptoAdressItemChange = (index: number, key: string, field: any, getValue?: ValueGetter) => {
    return handleItemChange(
      ['cryptoAddresses', index], key, field, templates.cryptoAddress, getValue,
    );
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
      <SimpleForm onSubmit={handleSubmit}>
        <fieldset disabled={isLoading}>
          <SitePreview soapbox={soapbox} />
          <FieldsGroup>
            <div className='fields-row file-picker'>
              <div className='fields-row__column fields-row__column-6'>
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
              </div>
              <div className='fields-row__column fields-group fields-row__column-6'>
                <FileChooserLogo
                  label={<FormattedMessage id='soapbox_config.fields.logo_label' defaultMessage='Logo' />}
                  name='logo'
                  hint={<FormattedMessage id='soapbox_config.hints.logo' defaultMessage='SVG. At most 2 MB. Will be displayed to 50px height, maintaining aspect ratio' />}
                  onChange={handleFileChange(['logo'])}
                />
              </div>
            </div>
          </FieldsGroup>
          <FieldsGroup>
            <TextInput
              name='copyright'
              label={intl.formatMessage(messages.copyrightFooterLabel)}
              placeholder={intl.formatMessage(messages.copyrightFooterLabel)}
              value={soapbox.copyright}
              onChange={handleChange(['copyright'], (e) => e.target.value)}
            />
          </FieldsGroup>
          <FieldsGroup>
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
              <TextInput
                name='singleUserModeProfile'
                label={intl.formatMessage(messages.singleUserModeProfileLabel)}
                placeholder={intl.formatMessage(messages.singleUserModeProfileHint)}
                value={soapbox.singleUserModeProfile}
                onChange={handleChange(['singleUserModeProfile'], (e) => e.target.value)}
              />
            )}
          </FieldsGroup>
          <FieldsGroup>
            <div className='input with_block_label popup'>
              <label><FormattedMessage id='soapbox_config.fields.promo_panel_fields_label' defaultMessage='Promo panel items' /></label>
              <span className='hint'>
                <FormattedMessage id='soapbox_config.hints.promo_panel_fields' defaultMessage='You can have custom defined links displayed on the right panel of the timelines page.' />
              </span>
              <span className='hint'>
                <FormattedMessage id='soapbox_config.hints.promo_panel_icons' defaultMessage='{ link }' values={{ link: <a target='_blank' href='https://icons8.com/line-awesome'>{intl.formatMessage(messages.promoPanelIconsLink)}</a> }} />
              </span>
              {
                soapbox.promoPanel.items.map((field, i) => (
                  <div className='row' key={i}>
                    <IconPicker
                      label={intl.formatMessage(messages.promoItemIcon)}
                      value={field.icon}
                      // @ts-ignore
                      onChange={handlePromoItemChange(i, 'icon', field, val => val.id)}
                    />
                    <TextInput
                      label={intl.formatMessage(messages.promoItemLabel)}
                      placeholder={intl.formatMessage(messages.promoItemLabel)}
                      value={field.text}
                      onChange={handlePromoItemChange(i, 'text', field)}
                    />
                    <TextInput
                      label={intl.formatMessage(messages.promoItemURL)}
                      placeholder={intl.formatMessage(messages.promoItemURL)}
                      value={field.url}
                      onChange={handlePromoItemChange(i, 'url', field)}
                    />
                    <Icon className='delete-field' src={require('@tabler/icons/icons/circle-x.svg')} onClick={handleDeleteItem(['promoPanel', 'items', i])} />
                  </div>
                ))
              }
              <div className='actions add-row'>
                <div role='presentation' className='btn button button-secondary' onClick={handleAddItem(['promoPanel', 'items'], templates.promoPanelItem)}>
                  <Icon src={require('@tabler/icons/icons/circle-plus.svg')} />
                  <FormattedMessage id='soapbox_config.fields.promo_panel.add' defaultMessage='Add new Promo panel item' />
                </div>
              </div>
            </div>
          </FieldsGroup>
          <FieldsGroup>
            <div className='input with_block_label'>
              <label><FormattedMessage id='soapbox_config.fields.home_footer_fields_label' defaultMessage='Home footer items' /></label>
              <span className='hint'>
                <FormattedMessage id='soapbox_config.hints.home_footer_fields' defaultMessage='You can have custom defined links displayed on the footer of your static pages' />
              </span>
              {
                soapbox.navlinks.get('homeFooter')?.map((field, i) => (
                  <div className='row' key={i}>
                    <TextInput
                      label={intl.formatMessage(messages.homeFooterItemLabel)}
                      placeholder={intl.formatMessage(messages.homeFooterItemLabel)}
                      value={field.title}
                      onChange={handleHomeFooterItemChange(i, 'title', field)}
                    />
                    <TextInput
                      label={intl.formatMessage(messages.homeFooterItemURL)}
                      placeholder={intl.formatMessage(messages.homeFooterItemURL)}
                      value={field.url}
                      onChange={handleHomeFooterItemChange(i, 'url', field)}
                    />
                    <Icon className='delete-field' src={require('@tabler/icons/icons/circle-x.svg')} onClick={handleDeleteItem(['navlinks', 'homeFooter', i])} />
                  </div>
                ))
              }
              <div className='actions add-row'>
                <div role='presentation' className='btn button button-secondary' onClick={handleAddItem(['navlinks', 'homeFooter'], templates.footerItem)}>
                  <Icon src={require('@tabler/icons/icons/circle-plus.svg')} />
                  <FormattedMessage id='soapbox_config.fields.home_footer.add' defaultMessage='Add new Home Footer Item' />
                </div>
              </div>
            </div>
          </FieldsGroup>
          <FieldsGroup>
            <div className='input with_block_label'>
              <label><FormattedMessage id='soapbox_config.fields.crypto_addresses_label' defaultMessage='Cryptocurrency addresses' /></label>
              <span className='hint'>
                <FormattedMessage id='soapbox_config.hints.crypto_addresses' defaultMessage='Add cryptocurrency addresses so users of your site can donate to you. Order matters, and you must use lowercase ticker values.' />
              </span>
              {
                soapbox.cryptoAddresses.map((address, i) => (
                  <div className='row' key={i}>
                    <TextInput
                      label={intl.formatMessage(messages.cryptoAdressItemTicker)}
                      placeholder={intl.formatMessage(messages.cryptoAdressItemTicker)}
                      value={address.ticker}
                      onChange={handleCryptoAdressItemChange(i, 'ticker', address)}
                    />
                    <TextInput
                      label={intl.formatMessage(messages.cryptoAdressItemAddress)}
                      placeholder={intl.formatMessage(messages.cryptoAdressItemAddress)}
                      value={address.address}
                      onChange={handleCryptoAdressItemChange(i, 'address', address)}
                    />
                    <TextInput
                      label={intl.formatMessage(messages.cryptoAdressItemNote)}
                      placeholder={intl.formatMessage(messages.cryptoAdressItemNote)}
                      value={address.note}
                      onChange={handleCryptoAdressItemChange(i, 'note', address)}
                    />
                    <Icon className='delete-field' src={require('@tabler/icons/icons/circle-x.svg')} onClick={handleDeleteItem(['cryptoAddresses', i])} />
                  </div>
                ))
              }
              <div className='actions add-row'>
                <div role='presentation' className='btn button button-secondary' onClick={handleAddItem(['cryptoAddresses'], templates.cryptoAddress)}>
                  <Icon src={require('@tabler/icons/icons/circle-plus.svg')} />
                  <FormattedMessage id='soapbox_config.fields.crypto_address.add' defaultMessage='Add new crypto address' />
                </div>
              </div>
            </div>
          </FieldsGroup>
          <FieldsGroup>
            <SimpleInput
              type='number'
              min={0}
              pattern='[0-9]+'
              name='cryptoDonatePanelLimit'
              label={intl.formatMessage(messages.cryptoDonatePanelLimitLabel)}
              placeholder={intl.formatMessage(messages.cryptoDonatePanelLimitLabel)}
              value={soapbox.cryptoDonatePanel.get('limit')}
              onChange={handleChange(['cryptoDonatePanel', 'limit'], (e) => Number(e.target.value))}
            />
          </FieldsGroup>
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
        <div className='actions'>
          <button name='button' type='submit' className='btn button button-primary'>
            <FormattedMessage id='soapbox_config.save' defaultMessage='Save' />
          </button>
        </div>
      </SimpleForm>
    </Column>
  );
};

export default SoapboxConfig;
