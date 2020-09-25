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
  Checkbox,
  FileChooser,
  SimpleTextarea,
  FileChooserLogo,
  FormPropTypes,
} from 'soapbox/features/forms';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import { updateAdminConfig } from 'soapbox/actions/admin';
import Icon from 'soapbox/components/icon';
import { defaultConfig } from 'soapbox/actions/soapbox';
import { uploadMedia } from 'soapbox/actions/media';
import { SketchPicker } from 'react-color';
import Overlay from 'react-overlays/lib/Overlay';
import { isMobile } from 'soapbox/is_mobile';
import detectPassiveEvents from 'detect-passive-events';

const messages = defineMessages({
  heading: { id: 'column.soapbox_config', defaultMessage: 'Soapbox config' },
  copyrightFooterLabel: { id: 'soapbox_config.copyright_footer.meta_fields.label_placeholder', defaultMessage: 'Copyright footer' },
  promoItemIcon: { id: 'soapbox_config.promo_panel.meta_fields.icon_placeholder', defaultMessage: 'Icon' },
  promoItemLabel: { id: 'soapbox_config.promo_panel.meta_fields.label_placeholder', defaultMessage: 'Label' },
  promoItemURL: { id: 'soapbox_config.promo_panel.meta_fields.url_placeholder', defaultMessage: 'URL' },
  homeFooterItemLabel: { id: 'soapbox_config.home_footer.meta_fields.label_placeholder', defaultMessage: 'Label' },
  homeFooterItemURL: { id: 'soapbox_config.home_footer.meta_fields.url_placeholder', defaultMessage: 'URL' },
  customCssLabel: { id: 'soapbox_config.custom_css.meta_fields.url_placeholder', defaultMessage: 'URL' },
  rawJSONLabel: { id: 'soapbox_config.raw_json_label', defaultMessage: 'Raw JSON data' },
  rawJSONHint: { id: 'soapbox_config.raw_json_hint', defaultMessage: 'Advanced: Edit the settings data directly.' },
});

const listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false;

const templates = {
  promoPanelItem: ImmutableMap({ icon: '', text: '', url: '' }),
  footerItem: ImmutableMap({ title: '', url: '' }),
};

const mapStateToProps = state => ({
  soapbox: state.get('soapbox'),
});

export default @connect(mapStateToProps)
@injectIntl
class SoapboxConfig extends ImmutablePureComponent {

  static propTypes = {
    soapbox: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isLoading: false,
    soapbox: this.props.soapbox,
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
    return {
      configs: [{
        group: ':pleroma',
        key: ':frontend_configurations',
        value: [{
          tuple: [':soapbox_fe', soapbox.toJS()],
        }],
      }],
    };
  }

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    dispatch(updateAdminConfig(this.getParams())).then(() => {
      this.setState({ isLoading: false });
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

  handleItemChange = (path, key, field, template) => {
    return this.handleChange(
      path, (e) =>
        template
          .merge(field)
          .set(key, e.target.value)
    );
  };

  handlePromoItemChange = (index, key, field) => {
    return this.handleItemChange(
      ['promoPanel', 'items', index], key, field, templates.promoPanelItem
    );
  };

  handleHomeFooterItemChange = (index, key, field) => {
    return this.handleItemChange(
      ['navlinks', 'homeFooter', index], key, field, templates.footerItem
    );
  };

  handleEditJSON = e => {
    this.setState({ rawJSON: e.target.value });
  }

  getSoapboxConfig = () => {
    return defaultConfig.mergeDeep(this.state.soapbox);
  }

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
            <FieldsGroup>
              <div className='fields-row file-picker'>
                <div className='fields-row__column fields-row__column-6'>
                  <img src={soapbox.get('logo')} />
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
              <div className='fields-row file-picker'>
                <div className='fields-row__column fields-row__column-6'>
                  <img src={soapbox.get('banner')} />
                </div>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooser
                    label={<FormattedMessage id='soapbox_config.fields.banner_label' defaultMessage='Banner' />}
                    name='banner'
                    hint={<FormattedMessage id='soapbox_config.hints.banner' defaultMessage='PNG, GIF or JPG. At most 2 MB. Will be displayed to 400x400px' />}
                    onChange={this.handleFileChange(['banner'])}
                  />
                </div>
              </div>
            </FieldsGroup>
            <FieldsGroup>
              <div className='fields-row__column fields-group'>
                <ColorWithPicker
                  buttonId='brand_color'
                  label={<FormattedMessage id='soapbox_config.fields.brand_color_label' defaultMessage='Brand color' />}
                  value={soapbox.get('brandColor')}
                  onChange={this.handleChange(['brandColor'], (e) => e.hex)}
                />
              </div>
            </FieldsGroup>
            <FieldsGroup>
              <Checkbox
                label={<FormattedMessage id='soapbox_config.fields.patron_enabled_label' defaultMessage='Patron module' />}
                hint={<FormattedMessage id='soapbox_config.hints.patron_enabled' defaultMessage='Enables display of Patron module.  Requires installation of Patron module.' />}
                name='patron'
                checked={soapbox.getIn(['extensions', 'patron', 'enabled'])}
                onChange={this.handleChange(
                  ['extensions', 'patron', 'enabled'], (e) => e.checked,
                )}
              />
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
              <div className='fields-row__column fields-group'>
                <div className='input with_block_label'>
                  <label><FormattedMessage id='soapbox_config.fields.promo_panel_fields_label' defaultMessage='Promo panel items' /></label>
                  <span className='hint'>
                    <FormattedMessage id='soapbox_config.hints.promo_panel_fields' defaultMessage='You can have custom defined links displayed on the left panel of the timelines page.' />
                  </span>
                  <span className='hint'>
                    <FormattedMessage id='soapbox_config.hints.promo_panel_icons' defaultMessage='{ link }' values={{ link: <a target='_blank' href='https://forkaweso.me/Fork-Awesome/icons/'>Soapbox Icons List</a> }} />
                  </span>
                  {
                    soapbox.getIn(['promoPanel', 'items']).map((field, i) => (
                      <div className='row' key={i}>
                        <TextInput
                          label={intl.formatMessage(messages.promoItemIcon)}
                          placeholder={intl.formatMessage(messages.promoItemIcon)}
                          value={field.get('icon')}
                          onChange={this.handlePromoItemChange(i, 'icon', field)}
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
                  <div className='actions'>
                    <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddItem(['promoPanel', 'items'], templates.promoPanelItem)}>
                      <Icon id='plus-circle' />
                      <FormattedMessage id='soapbox_config.fields.promo_panel.add' defaultMessage='Add new Promo panel item' />
                    </div>
                  </div>
                </div>
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
                  <div className='actions'>
                    <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddItem(['navlinks', 'homeFooter'], templates.footerItem)}>
                      <Icon id='plus-circle' />
                      <FormattedMessage id='soapbox_config.fields.home_footer.add' defaultMessage='Add new Home Footer Item' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='input with_block_label'>
                <label><FormattedMessage id='soapbox_config.fields.custom_css_fields_label' defaultMessage='Custom CSS' /></label>
                <span className='hint'>
                  <FormattedMessage id='soapbox_config.hints.custom_css_fields' defaultMessage='Insert a URL to a CSS file like `https://mysite.com/instance/custom.css`, or simply `/instance/custom.css`' />
                </span>
                {
                  soapbox.get('customCss').map((field, i) => (
                    <div className='row' key={i}>
                      <TextInput
                        label={intl.formatMessage(messages.customCssLabel)}
                        placeholder={intl.formatMessage(messages.customCssLabel)}
                        value={field}
                        onChange={this.handleChange(['customCss', i], (e) => e.target.value)}
                      />
                      <Icon id='times-circle' onClick={this.handleDeleteItem(['customCss', i])} />
                    </div>
                  ))
                }
                <div className='actions'>
                  <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddItem(['customCss'], '')}>
                    <Icon id='plus-circle' />
                    <FormattedMessage id='soapbox_config.fields.custom_css.add' defaultMessage='Add another custom CSS URL' />
                  </div>
                </div>
              </div>
            </FieldsGroup>
            <FieldsGroup>
              <div className={this.state.jsonValid ? 'code-editor' : 'code-editor code-editor--invalid'}>
                <SimpleTextarea
                  label={intl.formatMessage(messages.rawJSONLabel)}
                  hint={intl.formatMessage(messages.rawJSONHint)}
                  value={this.state.rawJSON}
                  onChange={this.handleEditJSON}
                  rows={12}
                />
              </div>
            </FieldsGroup>
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
    let margin_left_picker = isMobile(window.innerWidth) ? '20px' : '12px';

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
