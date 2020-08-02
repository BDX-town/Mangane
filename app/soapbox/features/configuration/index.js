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
  ColorWithPicker,
  FileChooserLogo,
} from 'soapbox/features/forms';
import StillImage from 'soapbox/components/still_image';
import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';
import { postSoapbox } from 'soapbox/actions/soapbox';

const messages = defineMessages({
  heading: { id: 'column.soapbox_settings', defaultMessage: 'Soapbox settings' },
  promoItemIcon: { id: 'soapbox_settings.promo_panel.meta_fields.icon_placeholder', defaultMessage: 'Icon' },
  promoItemLabel: { id: 'soapbox_settings.promo_panel.meta_fields.label_placeholder', defaultMessage: 'Label' },
  promoItemURL: { id: 'soapbox_settings.promo_panel.meta_fields.url_placeholder', defaultMessage: 'URL' },
  homeFooterItemLabel: { id: 'soapbox_settings.home_footer.meta_fields.label_placeholder', defaultMessage: 'Label' },
  homeFooterItemURL: { id: 'soapbox_settings.home_footer.meta_fields.url_placeholder', defaultMessage: 'URL' },
  customCssLabel: { id: 'soapbox_settings.custom_css.meta_fields.url_placeholder', defaultMessage: 'URL' },
});

const mapStateToProps = state => {
  const soapbox = state.get('soapbox');
  return {
    brandColor: soapbox.get('brandColor'),
    customCssItems: soapbox.get('customCss'),
    logo: soapbox.get('logo'),
    banner: soapbox.get('banner'),
    promoItems: soapbox.getIn(['promoPanel', 'items']),
    patronEnabled: soapbox.getIn(['extensions', 'patron']),
    autoPlayGif: soapbox.getIn(['defaultSettings', 'autoPlayGif']),
    copyright: soapbox.get('copyright'),
    homeFooterItems: soapbox.getIn(['navlinks', 'homeFooter']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ConfigSoapbox extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    brandColor: PropTypes.string,
    customCssItems: ImmutablePropTypes.list,
    logo: PropTypes.string,
    banner: PropTypes.string,
    promoItems: ImmutablePropTypes.list,
    patronEnabled: PropTypes.bool,
    autoPlayGif: PropTypes.bool,
    copyright: PropTypes.string,
    homeFooterItems: ImmutablePropTypes.list,
  };

  state = {
    isLoading: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      logo: props.logo,
      banner: props.banner,
      brandColor: props.brandColor,
      customCssItems: props.customCssItems,
      promoItems: props.promoItems,
      homeFooterItems: props.homeFooterItems,
      copyright: props.copyright,
      patronEnabled: false,
      autoPlayGif: false,
    };
    if (!this.state.logo) {
      this.state.logo = '';
    }
    if (!this.state.banner) {
      this.state.banner = '';
    }
    if (!this.state.promoItems) {
      this.state.promoItems = ImmutableList([
        ImmutableMap({
          icon: '',
          text: '',
          url: '',
        }),
      ]);
    };
    if (!this.state.homeFooterItems) {
      this.state.homeFooterItems = ImmutableList([
        ImmutableMap({
          title: '',
          url: '',
        }),
      ]);
    };
    if (!this.state.customCssItems) {
      this.state.customCssItems = ImmutableList([]);
    };
    this.handlecustomCSSChange = this.handleCustomCSSChange.bind(this);
    this.handleAddPromoPanelItem = this.handleAddPromoPanelItem.bind(this);
    this.handleAddHomeFooterItem = this.handleAddHomeFooterItem.bind(this);
    this.handleAddCssItem = this.handleAddCssItem.bind(this);
    this.getParams = this.getParams.bind(this);
  }

  getParams = () => {
    const { state } = this;
    var obj = {
      configs: [{
        group: ':pleroma',
        key: ':frontend_configurations',
        value: [{
          tuple: [':soapbox_fe',
            {
              logo: '',
              banner: '',
              brandColor: '',
              customCss: [],
              promoPanel: {
                items: [],
              },
              extensions: {
                patron: false,
              },
              defaultSettings: {
                autoPlayGif: false,
              },
              copyright: '',
              navlinks: {
                homeFooter: [],
              },
            },
          ],
        }],
      }],
    };
    obj.configs[0].value[0].tuple[1].logo = state.logo;
    obj.configs[0].value[0].tuple[1].banner = state.banner;
    obj.configs[0].value[0].tuple[1].brandColor = state.brandColor;
    obj.configs[0].value[0].tuple[1].extensions.patron = state.patronEnabled;
    obj.configs[0].value[0].tuple[1].defaultSettings.autoPlayGif = state.autoPlayGif;
    obj.configs[0].value[0].tuple[1].copyright = state.copyright;
    this.state.homeFooterItems.forEach((f) =>
      obj.configs[0].value[0].tuple[1].navlinks.homeFooter.push({ title: f.get('title'), url: f.get('url') })
    );
    this.state.promoItems.forEach((f) =>
      obj.configs[0].value[0].tuple[1].promoPanel.items.push({ icon: f.get('icon'), text: f.get('text'), url: f.get('url') })
    );
    this.state.customCssItems.forEach((f) =>
      obj.configs[0].value[0].tuple[1].customCss.push(f)
    );
    return obj;
  }

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    dispatch(postSoapbox(this.getParams())).then(() => {
      this.setState({ isLoading: false });
    }).catch((error) => {
      this.setState({ isLoading: false });
    });
    this.setState({ isLoading: true });
    event.preventDefault();
  }

  handleCheckboxChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleBrandColorChange = e => {
    this.setState({ brandColor: e.hex });
  }

  handleTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handlePromoItemsChange = (i, key) => {
    return (e) => {
      this.setState({
        promoItems: this.state.promoItems.setIn([i, key], e.target.value),
      });
    };
  }

  handleHomeFooterItemsChange = (i, key) => {
    return (e) => {
      this.setState({
        homeFooterItems: this.state.homeFooterItems.setIn([i, key], e.target.value),
      });
    };
  }

  handleCustomCSSChange = i => {
    return (e) => {
      this.setState({
        customCssItems: this.state.customCssItems.setIn([i], e.target.value),
      });
    };
  }

  handleFileChange = e => {
    const { name } = e.target;
    const [file] = e.target.files || [];
    const url = file ? URL.createObjectURL(file) : this.state[name];

    this.setState({
      [name]: url,
      [`${name}_file`]: file,
    });
  }

  handleAddPromoPanelItem = () => {
    this.setState({
      promoItems: this.state.promoItems.concat([
        ImmutableMap({
          icon: '',
          text: '',
          url: '',
        }),
      ]),
    });
  }

  handleAddHomeFooterItem = () => {
    this.setState({
      homeFooterItems: this.state.homeFooterItems.concat([
        ImmutableMap({
          title: '',
          url: '',
        }),
      ]),
    });
  }

  handleAddCssItem = () => {
    this.setState({
      customCssItems: this.state.customCssItems.concat(['']),
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <Column icon='shield' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <FieldsGroup>
              <div className='fields-row'>
                <div className='fields-row__column fields-row__column-6'>
                  {this.state.logo ? (<StillImage src={this.state.logo || ''} />) : (<StillImage src={this.props.logo || ''} />)}
                </div>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooserLogo
                    label={<FormattedMessage id='soapbox_settings.fields.logo_label' defaultMessage='Logo' />}
                    name='logo'
                    hint={<FormattedMessage id='soapbox_settings.hints.logo' defaultMessage='SVG. At most 2 MB. Will be downscaled to 50px height, maintaining aspect ratio' />}
                    onChange={this.handleFileChange}
                  />
                </div>
              </div>
              <div className='fields-row'>
                <div className='fields-row__column fields-row__column-6'>
                  {this.state.banner ? (<StillImage src={this.state.banner || ''} />) : (<StillImage src={this.props.banner || ''} />)}
                </div>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooser
                    label={<FormattedMessage id='soapbox_settings.fields.banner_label' defaultMessage='Banner' />}
                    name='banner'
                    hint={<FormattedMessage id='soapbox_settings.hints.banner' defaultMessage='PNG, GIF or JPG. At most 2 MB. Will be downscaled to 400x400px' />}
                    onChange={this.handleFileChange}
                  />
                </div>
              </div>
            </FieldsGroup>
            <FieldsGroup>
              <div className='fields-row__column fields-group'>
                <ColorWithPicker
                  buttonId='brand_color'
                  label={<FormattedMessage id='soapbox_settings.fields.brand_color_label' defaultMessage='Brand color' />}
                  value={this.state.brandColor || '#0482d8'}
                  onChange={this.handleBrandColorChange}
                />
              </div>
            </FieldsGroup>
            <FieldsGroup>
              <Checkbox
                label={<FormattedMessage id='soapbox_settings.fields.patron_enabled_label' defaultMessage='Patron module' />}
                hint={<FormattedMessage id='soapbox_settings.hints.patron_enabled' defaultMessage='Enables display of Patron module.  Requires installation of Patron module.' />}
                name='patronEnabled'
                checked={this.state.patronEnabled ? this.state.patronEnabled : this.props.patronEnabled || false}
                onChange={this.handleCheckboxChange}
              />
              <Checkbox
                label={<FormattedMessage id='soapbox_settings.fields.auto_play_gif_label' defaultMessage='Auto-play GIFs' />}
                hint={<FormattedMessage id='soapbox_settings.hints.auto_play_gif' defaultMessage='Enable auto-playing of GIF files in timeline' />}
                name='autoPlayGif'
                checked={this.state.autoPlayGif ? this.state.autoPlayGif : this.props.autoPlayGif || false}
                onChange={this.handleCheckboxChange}
              />
            </FieldsGroup>
            <FieldsGroup>
              <div className='fields-row__column fields-group'>
                <div className='input with_block_label'>
                  <label><FormattedMessage id='soapbox_settings.fields.promo_panel_fields_label' defaultMessage='Promo panel items' /></label>
                  <span className='hint'>
                    <FormattedMessage id='soapbox_settings.hints.promo_panel_fields' defaultMessage='You can have custom defined links displayed on the left panel of the timelines page.' />
                  </span>
                  <span className='hint'>
                    <FormattedMessage id='soapbox_settings.hints.promo_panel_icons' defaultMessage='{ link }' values={{ link: <a target='_blank' href='https://forkaweso.me/Fork-Awesome/icons/'>Soapbox Icons List</a> }} />
                  </span>
                  {
                    this.state.promoItems.map((field, i) => (
                      <div className='row' key={i}>
                        <TextInput
                          label={intl.formatMessage(messages.promoItemIcon)}
                          placeholder={intl.formatMessage(messages.promoItemIcon)}
                          value={field.get('icon')}
                          onChange={this.handlePromoItemsChange(i, 'icon')}
                        />
                        <TextInput
                          label={intl.formatMessage(messages.promoItemLabel)}
                          placeholder={intl.formatMessage(messages.promoItemLabel)}
                          value={field.get('text')}
                          onChange={this.handlePromoItemsChange(i, 'text')}
                        />
                        <TextInput
                          label={intl.formatMessage(messages.promoItemURL)}
                          placeholder={intl.formatMessage(messages.promoItemURL)}
                          value={field.get('url')}
                          onChange={this.handlePromoItemsChange(i, 'url')}
                        />
                      </div>
                    ))
                  }
                  <div className='actions'>
                    <button name='button' type='button' className='btn button button-secondary' onClick={this.handleAddPromoPanelItem}>
                      <FormattedMessage id='soapbox_settings.fields.promo_panel.add' defaultMessage='Add new Promo panel item' />
                    </button>
                  </div>
                </div>
                <div className='input with_block_label'>
                  <label><FormattedMessage id='soapbox_settings.fields.home_footer_fields_label' defaultMessage='Home footer items' /></label>
                  <span className='hint'>
                    <FormattedMessage id='soapbox_settings.hints.home_footer_fields' defaultMessage='You can have custom defined links displayed on the footer of your static pages' />
                  </span>
                  {
                    this.state.homeFooterItems.map((field, i) => (
                      <div className='row' key={i}>
                        <TextInput
                          label={intl.formatMessage(messages.homeFooterItemLabel)}
                          placeholder={intl.formatMessage(messages.homeFooterItemLabel)}
                          value={field.get('title')}
                          onChange={this.handleHomeFooterItemsChange(i, 'title')}
                        />
                        <TextInput
                          label={intl.formatMessage(messages.homeFooterItemURL)}
                          placeholder={intl.formatMessage(messages.homeFooterItemURL)}
                          value={field.get('url')}
                          onChange={this.handleHomeFooterItemsChange(i, 'url')}
                        />
                      </div>
                    ))
                  }
                  <div className='actions'>
                    <button name='button' type='submit' className='btn button button-secondary' onClick={this.handleAddHomeFooterItem}>
                      <FormattedMessage id='soapbox_settings.fields.home_footer.add' defaultMessage='Add new Home Footer Item' />
                    </button>
                  </div>
                </div>
              </div>
              <div className='input with_block_label'>
                <label><FormattedMessage id='soapbox_settings.fields.custom_css_fields_label' defaultMessage='Custom CSS' /></label>
                <span className='hint'>
                  <FormattedMessage id='soapbox_settings.hints.custom_css_fields' defaultMessage='You can have custom CSS definitions' />
                </span>
                {
                  this.state.customCssItems.map((field, i) => (
                    <div className='row' key={i}>
                      <TextInput
                        label={intl.formatMessage(messages.customCssLabel)}
                        placeholder={intl.formatMessage(messages.customCssLabel)}
                        value={field}
                        onChange={this.handlecustomCSSChange(i)}
                      />
                    </div>
                  ))
                }
                <div className='actions'>
                  <button name='button' type='submit' className='btn button button-secondary' onClick={this.handleAddCssItem}>
                    <FormattedMessage id='soapbox_settings.fields.custom_css.add' defaultMessage='Add new Custom CSS item' />
                  </button>
                </div>
              </div>
            </FieldsGroup>
          </fieldset>
          <div className='actions'>
            <button name='button' type='submit' className='btn button button-primary'>
              <FormattedMessage id='soapbox_settings.save' defaultMessage='Save' />
            </button>
          </div>
        </SimpleForm>
      </Column>
    );
  }

}
