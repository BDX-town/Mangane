import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import {
  SimpleForm,
  FieldsGroup,
  TextInput,
  SimpleInput,
  SimpleTextarea,
  FileChooserLogo,
  FormPropTypes,
  Checkbox,
} from 'soapbox/features/forms';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import { updateConfig } from 'soapbox/actions/admin';
import Icon from 'soapbox/components/icon';
import { makeDefaultConfig } from 'soapbox/actions/soapbox';
import { getFeatures } from 'soapbox/utils/features';
import { uploadMedia } from 'soapbox/actions/media';
import { SketchPicker } from 'react-color';
import Overlay from 'react-overlays/lib/Overlay';
import { isMobile } from 'soapbox/is_mobile';
import { supportsPassiveEvents } from 'detect-passive-events';
import Accordion from '../ui/components/accordion';
import SitePreview from './components/site_preview';
import ThemeToggle from 'soapbox/features/ui/components/theme_toggle';
import IconPickerDropdown from './components/icon_picker_dropdown';
import snackbar from 'soapbox/actions/snackbar';

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
});

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;

const templates = {
  promoPanelItem: ImmutableMap({ icon: '', text: '', url: '' }),
  footerItem: ImmutableMap({ title: '', url: '' }),
  cryptoAddress: ImmutableMap({ ticker: '', address: '', note: '' }),
};

const mapStateToProps = state => {
  const instance = state.get('instance');

  return {
    soapbox: state.get('soapbox'),
    features: getFeatures(instance),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class SoapboxConfig extends ImmutablePureComponent {

  static propTypes = {
    soapbox: ImmutablePropTypes.map.isRequired,
    features: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isLoading: false,
    soapbox: this.props.soapbox,
    jsonEditorExpanded: false,
    rawJSON: JSON.stringify(this.props.soapbox, null, 2),
    jsonValid: true,
  }

  setConfig = (path, value) => {
    const { soapbox } = this.state;
    const config = soapbox.setIn(path, value);
    this.setState({ soapbox: config, jsonValid: true });
  };

  putConfig = config => {
    this.setState({ soapbox: config, jsonValid: true });
  };

  getParams = () => {
    const { soapbox } = this.state;
    return [{
      group: ':pleroma',
      key: ':frontend_configurations',
      value: [{
        tuple: [':soapbox_fe', soapbox.toJS()],
      }],
    }];
  }

  handleSubmit = (event) => {
    const { dispatch, intl } = this.props;
    dispatch(updateConfig(this.getParams())).then(() => {
      this.setState({ isLoading: false });
      dispatch(snackbar.success(intl.formatMessage(messages.saved)));
    }).catch((error) => {
      this.setState({ isLoading: false });
    });
    this.setState({ isLoading: true });
    event.preventDefault();
  }

  handleChange = (path, getValue) => {
    return e => {
      this.setConfig(path, getValue(e));
    };
  };

  handleFileChange = path => {
    return e => {
      const data = new FormData();
      data.append('file', e.target.files[0]);
      this.props.dispatch(uploadMedia(data)).then(({ data }) => {
        this.handleChange(path, e => data.url)(e);
      }).catch(() => {});
    };
  };

  handleAddItem = (path, template) => {
    return e => {
      this.setConfig(
        path,
        this.getSoapboxConfig().getIn(path, ImmutableList()).push(template),
      );
    };
  };

  handleDeleteItem = path => {
    return e => {
      const soapbox = this.state.soapbox.deleteIn(path);
      this.setState({ soapbox });
    };
  };

  handleItemChange = (path, key, field, template, getValue = e => e.target.value) => {
    return this.handleChange(
      path, (e) =>
        template
          .merge(field)
          .set(key, getValue(e)),
    );
  };

  handlePromoItemChange = (index, key, field, getValue) => {
    return this.handleItemChange(
      ['promoPanel', 'items', index], key, field, templates.promoPanelItem, getValue,
    );
  };

  handleHomeFooterItemChange = (index, key, field, getValue) => {
    return this.handleItemChange(
      ['navlinks', 'homeFooter', index], key, field, templates.footerItem, getValue,
    );
  };

  handleCryptoAdressItemChange = (index, key, field, getValue) => {
    return this.handleItemChange(
      ['cryptoAddresses', index], key, field, templates.cryptoAddress, getValue,
    );
  };

  handleEditJSON = e => {
    this.setState({ rawJSON: e.target.value });
  }

  getSoapboxConfig = () => {
    const { features } = this.props;
    const { soapbox } = this.state;
    return makeDefaultConfig(features).mergeDeep(soapbox);
  }

  toggleJSONEditor = (value) => this.setState({ jsonEditorExpanded: value });

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.soapbox !== this.props.soapbox) {
      this.putConfig(this.props.soapbox);
    }

    if (prevState.soapbox !== this.state.soapbox) {
      this.setState({ rawJSON: JSON.stringify(this.state.soapbox, null, 2) });
    }

    if (prevState.rawJSON !== this.state.rawJSON) {
      try {
        const data = fromJS(JSON.parse(this.state.rawJSON));
        this.putConfig(data);
      } catch {
        this.setState({ jsonValid: false });
      }
    }
  }

  render() {
    const { intl } = this.props;
    const soapbox = this.getSoapboxConfig();

    return (
      <Column icon='cog' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <SitePreview soapbox={soapbox} />
            <FieldsGroup>
              <div className='fields-row file-picker'>
                <div className='fields-row__column fields-row__column-6'>
                  <ColorWithPicker
                    buttonId='brand_color'
                    label={<FormattedMessage id='soapbox_config.fields.brand_color_label' defaultMessage='Brand color' />}
                    value={soapbox.get('brandColor')}
                    onChange={this.handleChange(['brandColor'], (e) => e.hex)}
                  />
                  <div className='input with_label toggle'>
                    <div className='label_input'>
                      <label><FormattedMessage id='soapbox_config.fields.theme_label' defaultMessage='Default theme' /></label>
                      <ThemeToggle
                        onToggle={this.handleChange(['defaultSettings', 'themeMode'], value => value)}
                        themeMode={soapbox.getIn(['defaultSettings', 'themeMode'])}
                        intl={intl}
                      />
                    </div>
                  </div>
                </div>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooserLogo
                    label={<FormattedMessage id='soapbox_config.fields.logo_label' defaultMessage='Logo' />}
                    name='logo'
                    hint={<FormattedMessage id='soapbox_config.hints.logo' defaultMessage='SVG. At most 2 MB. Will be displayed to 50px height, maintaining aspect ratio' />}
                    onChange={this.handleFileChange(['logo'])}
                  />
                </div>
              </div>
            </FieldsGroup>
            <FieldsGroup>
              <TextInput
                name='copyright'
                label={intl.formatMessage(messages.copyrightFooterLabel)}
                placeholder={intl.formatMessage(messages.copyrightFooterLabel)}
                value={soapbox.get('copyright')}
                onChange={this.handleChange(['copyright'], (e) => e.target.value)}
              />
            </FieldsGroup>
            <FieldsGroup>
              <Checkbox
                name='verifiedCanEditName'
                label={intl.formatMessage(messages.verifiedCanEditNameLabel)}
                checked={soapbox.get('verifiedCanEditName') === true}
                onChange={this.handleChange(['verifiedCanEditName'], (e) => e.target.checked)}
              />
              <Checkbox
                name='displayFqn'
                label={intl.formatMessage(messages.displayFqnLabel)}
                checked={soapbox.get('displayFqn') === true}
                onChange={this.handleChange(['displayFqn'], (e) => e.target.checked)}
              />
              <Checkbox
                name='greentext'
                label={intl.formatMessage(messages.greentextLabel)}
                checked={soapbox.get('greentext') === true}
                onChange={this.handleChange(['greentext'], (e) => e.target.checked)}
              />
              <Checkbox
                name='authenticatedProfile'
                label={intl.formatMessage(messages.authenticatedProfileLabel)}
                hint={intl.formatMessage(messages.authenticatedProfileHint)}
                checked={soapbox.get('authenticatedProfile') === true}
                onChange={this.handleChange(['authenticatedProfile'], (e) => e.target.checked)}
              />
            </FieldsGroup>
            <FieldsGroup>
              <div className='input with_block_label popup'>
                <label><FormattedMessage id='soapbox_config.fields.promo_panel_fields_label' defaultMessage='Promo panel items' /></label>
                <span className='hint'>
                  <FormattedMessage id='soapbox_config.hints.promo_panel_fields' defaultMessage='You can have custom defined links displayed on the right panel of the timelines page.' />
                </span>
                <span className='hint'>
                  <FormattedMessage id='soapbox_config.hints.promo_panel_icons' defaultMessage='{ link }' values={{ link: <a target='_blank' href='https://forkaweso.me/Fork-Awesome/icons/'>{intl.formatMessage(messages.promoPanelIconsLink)}</a> }} />
                </span>
                {
                  soapbox.getIn(['promoPanel', 'items']).map((field, i) => (
                    <div className='row' key={i}>
                      <IconPicker
                        label={intl.formatMessage(messages.promoItemIcon)}
                        value={field.get('icon')}
                        onChange={this.handlePromoItemChange(i, 'icon', field, val => val.id)}
                      />
                      <TextInput
                        label={intl.formatMessage(messages.promoItemLabel)}
                        placeholder={intl.formatMessage(messages.promoItemLabel)}
                        value={field.get('text')}
                        onChange={this.handlePromoItemChange(i, 'text', field)}
                      />
                      <TextInput
                        label={intl.formatMessage(messages.promoItemURL)}
                        placeholder={intl.formatMessage(messages.promoItemURL)}
                        value={field.get('url')}
                        onChange={this.handlePromoItemChange(i, 'url', field)}
                      />
                      <Icon id='times-circle' onClick={this.handleDeleteItem(['promoPanel', 'items', i])} />
                    </div>
                  ))
                }
                <div className='actions add-row'>
                  <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddItem(['promoPanel', 'items'], templates.promoPanelItem)}>
                    <Icon id='plus-circle' />
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
                  soapbox.getIn(['navlinks', 'homeFooter']).map((field, i) => (
                    <div className='row' key={i}>
                      <TextInput
                        label={intl.formatMessage(messages.homeFooterItemLabel)}
                        placeholder={intl.formatMessage(messages.homeFooterItemLabel)}
                        value={field.get('title')}
                        onChange={this.handleHomeFooterItemChange(i, 'title', field)}
                      />
                      <TextInput
                        label={intl.formatMessage(messages.homeFooterItemURL)}
                        placeholder={intl.formatMessage(messages.homeFooterItemURL)}
                        value={field.get('url')}
                        onChange={this.handleHomeFooterItemChange(i, 'url', field)}
                      />
                      <Icon id='times-circle' onClick={this.handleDeleteItem(['navlinks', 'homeFooter', i])} />
                    </div>
                  ))
                }
                <div className='actions add-row'>
                  <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddItem(['navlinks', 'homeFooter'], templates.footerItem)}>
                    <Icon id='plus-circle' />
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
                  soapbox.get('cryptoAddresses').map((address, i) => (
                    <div className='row' key={i}>
                      <TextInput
                        label={intl.formatMessage(messages.cryptoAdressItemTicker)}
                        placeholder={intl.formatMessage(messages.cryptoAdressItemTicker)}
                        value={address.get('ticker')}
                        onChange={this.handleCryptoAdressItemChange(i, 'ticker', address)}
                      />
                      <TextInput
                        label={intl.formatMessage(messages.cryptoAdressItemAddress)}
                        placeholder={intl.formatMessage(messages.cryptoAdressItemAddress)}
                        value={address.get('address')}
                        onChange={this.handleCryptoAdressItemChange(i, 'address', address)}
                      />
                      <TextInput
                        label={intl.formatMessage(messages.cryptoAdressItemNote)}
                        placeholder={intl.formatMessage(messages.cryptoAdressItemNote)}
                        value={address.get('note')}
                        onChange={this.handleCryptoAdressItemChange(i, 'note', address)}
                      />
                      <Icon id='times-circle' onClick={this.handleDeleteItem(['cryptoAddresses', i])} />
                    </div>
                  ))
                }
                <div className='actions add-row'>
                  <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddItem(['cryptoAddresses'], templates.cryptoAddress)}>
                    <Icon id='plus-circle' />
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
                value={soapbox.getIn(['cryptoDonatePanel', 'limit'])}
                onChange={this.handleChange(['cryptoDonatePanel', 'limit'], (e) => Number(e.target.value))}
              />
            </FieldsGroup>
            <Accordion
              headline={intl.formatMessage(messages.rawJSONLabel)}
              expanded={this.state.jsonEditorExpanded}
              onToggle={this.toggleJSONEditor}
            >
              <div className={this.state.jsonValid ? 'code-editor' : 'code-editor code-editor--invalid'}>
                <SimpleTextarea
                  hint={intl.formatMessage(messages.rawJSONHint)}
                  value={this.state.rawJSON}
                  onChange={this.handleEditJSON}
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
  }

}

class ColorPicker extends React.PureComponent {

  static propTypes = {
    style: PropTypes.object,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  }

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  render() {
    const { style, value, onChange } = this.props;
    const margin_left_picker = isMobile(window.innerWidth) ? '20px' : '12px';

    return (
      <div id='SketchPickerContainer' ref={this.setRef} style={{ ...style, marginLeft: margin_left_picker, position: 'absolute', zIndex: 1000 }}>
        <SketchPicker color={value} disableAlpha onChange={onChange} />
      </div>
    );
  }

}

class ColorWithPicker extends ImmutablePureComponent {

  static propTypes = {
    buttonId: PropTypes.string.isRequired,
    label: FormPropTypes.label,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  onToggle = (e) => {
    if (!e.key || e.key === 'Enter') {
      if (this.state.active) {
        this.onHidePicker();
      } else {
        this.onShowPicker(e);
      }
    }
  }

  state = {
    active: false,
    placement: null,
  }

  onHidePicker = () => {
    this.setState({ active: false });
  }

  onShowPicker = ({ target }) => {
    this.setState({ active: true });
    this.setState({ placement: isMobile(window.innerWidth) ? 'bottom' : 'right' });
  }

  render() {
    const { buttonId, label, value, onChange } = this.props;
    const { active, placement } = this.state;

    return (
      <div className='label_input__color'>
        <label>{label}</label>
        <div id={buttonId} className='color-swatch' role='presentation' style={{ background: value }} title={value} value={value} onClick={this.onToggle} />
        <Overlay show={active} placement={placement} target={this}>
          <ColorPicker value={value} onChange={onChange} onClose={this.onHidePicker} />
        </Overlay>
      </div>
    );
  }

}

export class IconPicker extends ImmutablePureComponent {

  static propTypes = {
    icons: PropTypes.object,
    label: FormPropTypes.label,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const { onChange, value, label } = this.props;

    return (
      <div className='input with_label font_icon_picker'>
        <div className='label_input__font_icon_picker'>
          {label && (<label>{label}</label>)}
          <div className='label_input_wrapper'>
            <IconPickerDropdown value={value} onPickEmoji={onChange} />
          </div>
        </div>
      </div>
    );
  }

}
