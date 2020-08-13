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
  // List as ImmutableList,
  getIn,
} from 'immutable';
import { postSoapbox } from 'soapbox/actions/soapbox';

const messages = defineMessages({
  heading: { id: 'column.soapbox_settings', defaultMessage: 'Soapbox settings' },
  copyrightFooterLabel: { id: 'soapbox_settings.copyright_footer.meta_fields.label_placeholder', defaultMessage: 'Copyright footer' },
  promoItemIcon: { id: 'soapbox_settings.promo_panel.meta_fields.icon_placeholder', defaultMessage: 'Icon' },
  promoItemLabel: { id: 'soapbox_settings.promo_panel.meta_fields.label_placeholder', defaultMessage: 'Label' },
  promoItemURL: { id: 'soapbox_settings.promo_panel.meta_fields.url_placeholder', defaultMessage: 'URL' },
  homeFooterItemLabel: { id: 'soapbox_settings.home_footer.meta_fields.label_placeholder', defaultMessage: 'Label' },
  homeFooterItemURL: { id: 'soapbox_settings.home_footer.meta_fields.url_placeholder', defaultMessage: 'URL' },
  customCssLabel: { id: 'soapbox_settings.custom_css.meta_fields.url_placeholder', defaultMessage: 'URL' },
});

const mapStateToProps = state => {
  // const soapbox = state.get('soapbox');
  return {
    soapbox: state.get('soapbox'),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ConfigSoapbox extends ImmutablePureComponent {

  static propTypes = {
    soapbox: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isLoading: false,
  }

  // constructor(props) {
  //   super(props);
    // const initialState = props.soapbox.withMutations(map => {
    // });
    // this.state = ImmutableMap(props.soapbox);
    // this.state = ImmutableMap(props.soapbox);
    // console.log(JSON.stringify(this.state, null, 2));
    // if (!this.state.logo) {
    //   this.state.concat({ logo: '' });
    // }
    // if (!this.state.banner) {
    //   this.state.concat({ banner: '' });
    // }
    // if (getIn(this.state, ['defaultSettings', 'autoPlayGif'], 'notSet') === 'notSet') {
    //   this.state.concat({ defaultSettings: { autoPlayGif: false } });
    // };
    // if (getIn(this.state, ['extensions', 'patron'], 'notSet') === 'notSet') {
    //   this.state.concat({ extensions: { patron: false } });
    //   // this.state.extensions.patron = false;
    // };
    // if (getIn(this.state, ['promoPanel', 'items', 'icon'], 'notSet') === 'notSet') {
    //   this.state = {
    //     promoPanel: {
    //       items: [
    //         {
    //           icon: '',
    //           text: '',
    //           url: '',
    //         },
    //       ],
    //     },
    //   };
      // this.state.promoPanel.items = ImmutableList([
      //   ImmutableMap({
      //     icon: '',
      //     text: '',
      //     url: '',
      //   }),
      // ]);
    // };
    // console.log(JSON.stringify(this.state, null, 2));
    // if (!this.state.promoPanel.items) {
    //   this.state.promoPanel.items = ImmutableList([
    //     ImmutableMap({
    //       icon: '',
    //       text: '',
    //       url: '',
    //     }),
    //   ]);
    // };
    // if (!this.state.navlinks.homeFooter) {
    //   this.state.navlinks.homeFooter = ImmutableList([
    //     ImmutableMap({
    //       title: '',
    //       url: '',
    //     }),
    //   ]);
    // };
    // if (!this.state.customCssItems) {
    //   this.state.customCssItems = ImmutableList([' ']);
    // };
    // this.handlecustomCSSChange = this.handleCustomCSSChange.bind(this);
    // this.handleAddPromoPanelItem = this.handleAddPromoPanelItem.bind(this);
    // this.handleAddHomeFooterItem = this.handleAddHomeFooterItem.bind(this);
    // this.handleAddCssItem = this.handleAddCssItem.bind(this);
    // this.handleExtensionsCheckboxChange = this.handleExtensionsCheckboxChange.bind(this);
    // this.handleDefaultSettingsCheckboxChange = this.handleDefaultSettingsCheckboxChange.bind(this);
    // this.handleBrandColorChange = this.handleBrandColorChange.bind(this);
    // this.getParams = this.getParams.bind(this);
  // }

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
    obj.configs[0].value[0].tuple[1].logo = (state.logo ? state.logo : this.props.soapbox.logo);
    obj.configs[0].value[0].tuple[1].banner = (state.banner ? state.banner : this.props.soapbox.banner);
    obj.configs[0].value[0].tuple[1].brandColor = (state.brandColor ? state.brandColor : this.props.soapbox.brandcolor);
    obj.configs[0].value[0].tuple[1].extensions.patron = (state.patron ? state.patron : this.props.soapbox.extensions.patron);
    obj.configs[0].value[0].tuple[1].defaultSettings.autoPlayGif = (state.autoPlayGif ? state.autoPlayGif : this.props.soapbox.defaultSettings.autoPlayGif);
    obj.configs[0].value[0].tuple[1].copyright = (state.copyright ? state.copyright : this.props.soapbox.copyright);
    var homeFooterItems = (state.homeFooterItems ? state.homeFooterItems : this.props.soapbox.navlinks.homeFooter);
    homeFooterItems.forEach((f) =>
      obj.configs[0].value[0].tuple[1].navlinks.homeFooter.push({ title: f.get('title'), url: f.get('url') })
    );
    var promoPanelItems = (state.promoPanelItems ? state.promoPanelItems : this.props.soapbox.promoPanel.items);
    promoPanelItems.forEach((f) =>
      obj.configs[0].value[0].tuple[1].promoPanel.items.push({ icon: f.get('icon'), text: f.get('text'), url: f.get('url') })
    );
    var customCssItems = (state.customCssItems ? state.customCssItems : this.props.soapbox.customCss);
    customCssItems.forEach((f) =>
      obj.configs[0].value[0].tuple[1].customCss.push(f)
    );
    console.log(JSON.stringify(obj, null, 2));
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

  handlePatronCheckboxChange = e => {
    // var extensions = { ...this.state.extensions };
    // if (e.target.name === 'patron') {
    //   extensions.patron = e.target.value;
    // }
    var isChecked = (e.target.value === 'true');
    this.setState({ patron: isChecked });
    // this.setState({
    //   extensions: this.state.setIn(['extensions', e.target.name], e.target.value),
    // });
  }

  handleAutoPlayGifCheckboxChange = e => {
    // var defaultSettings = { ...this.state.defaultSettings };
    // if (e.target.name === 'autoPlayGif') {
    //   defaultSettings.autoPlayGif = e.target.value;
    // }
    var isChecked = (e.target.value === 'true');
    this.setState({ autoPlayGif: isChecked });
    // this.setState({
    //   defaultSettings: this.state.setIn(['defaultSettings', '[e.target.name]'], e.target.value),
    // });
  }

  handleBrandColorChange = e => {
    this.setState({
      brandColor: e.hex,
    });
    // this.state.setIn(['brandColor'], e.hex);
  }

  handleTextChange = e => {
    // this.state.soapbox.setIn(['{e.target.name}'], e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handlePromoItemsChange = (i, key) => {
    return (e) => {
      // this.state.soapbox.promoItems.setIn([i, key], e.target.value);
      this.setState({
        promoPanelitems: this.state.promoPanelItems.setIn([i, key], e.target.value),
      });
    };
  }

  handleHomeFooterItemsChange = (i, key) => {
    return (e) => {
      // this.state.soapbox.homeFooterItems.setIn([i, key], e.target.value);
      this.setState({
        homeFooterItems: this.state.homeFooterItems.setIn([i, key], e.target.value),
      });
    };
  }

  handleCustomCSSChange = i => {
    return (e) => {
      // this.state.soapbox.customCssItems.setIn([i], e.target.value);
      this.setState({
        customCssItems: this.state.customCssItems.setIn([i], e.target.value),
      });
    };
  }

  handleFileChange = e => {
    const { name } = e.target;
    const [file] = e.target.files || [];
    const url = file ? URL.createObjectURL(file) : this.state[name];
    // this.state.soapbox.setIn([name], url);
    // this.state.soapbox.setIn([`${name}_file`], file);

    this.setState({
      [name]: url,
      [`${name}_file`]: file,
    });
  }

  handleAddPromoPanelItem = () => {

    this.setState({
      promoPanelItems: this.state.promoPanelItems.concat([
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
    const logo = (this.state.logo ? this.state.logo : getIn(this.props.soapbox, ['logo'], ''));
    const banner = (this.state.banner ? this.state.banner : getIn(this.props.soapbox, ['banner'], ''));
    const brandColor = (this.state.brandColor ? this.state.brandColor : getIn(this.props.soapbox, ['brandColor'], ''));
    const patron = (this.state.patron ? this.state.patron : getIn(this.props.soapbox, ['extensions'], ['patron'], false));
    const autoPlayGif = (this.state.autoPlayGif ? this.state.autoPlayGif : getIn(this.props.soapbox, ['defaultSettings'], ['autoPlayGif'], false));
    const promoPanelItems = (this.state.promoPanelItems ? this.state.promoPanelItems : getIn(this.props.soapbox, ['promoPanel'], ['items'], []));
    const homeFooterItems = (this.state.homeFooterItems ? this.state.homeFooterItems : getIn(this.props.soapbox, ['navlinks'], ['homeFooter'], []));
    const customCssItems = (this.state.customCssItems ? this.state.customCssItems : getIn(this.props.soapbox, ['customCss'], []));
    const copyright = (this.state.copyright ? this.state.copyright : getIn(this.props.soapbox, ['copyright'], ''));
    console.log(promoPanelItems);
    console.log(homeFooterItems);
    console.log(customCssItems);

    return (
      <Column icon='shield' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <FieldsGroup>
              <div className='fields-row'>
                <div className='fields-row__column fields-row__column-6'>
                  <StillImage src={logo} />
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
                  {this.state.banner ? (<StillImage src={this.state.banner} />) : (<StillImage src={banner || ''} />)}
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
                  value={brandColor}
                  onChange={this.handleBrandColorChange}
                />
              </div>
            </FieldsGroup>
            <FieldsGroup>
              <Checkbox
                label={<FormattedMessage id='soapbox_settings.fields.patron_enabled_label' defaultMessage='Patron module' />}
                hint={<FormattedMessage id='soapbox_settings.hints.patron_enabled' defaultMessage='Enables display of Patron module.  Requires installation of Patron module.' />}
                name='patron'
                checked={patron}
                onChange={this.handlePatronCheckboxChange}
              />
              <Checkbox
                label={<FormattedMessage id='soapbox_settings.fields.auto_play_gif_label' defaultMessage='Auto-play GIFs' />}
                hint={<FormattedMessage id='soapbox_settings.hints.auto_play_gif' defaultMessage='Enable auto-playing of GIF files in timeline' />}
                name='autoPlayGif'
                checked={autoPlayGif}
                onChange={this.handleAutoPlayGifCheckboxChange}
              />
            </FieldsGroup>
            <FieldsGroup>
              <TextInput
                name='copyright'
                label={intl.formatMessage(messages.copyrightFooterLabel)}
                placeholder={intl.formatMessage(messages.copyrightFooterLabel)}
                value={copyright}
                onChange={this.handleTextChange}
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
                    promoPanelItems.valueSeq().map((field, i) => (
                    // promoPanelItems.map((field, i) => (
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
                    <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddPromoPanelItem}>
                      <FormattedMessage id='soapbox_settings.fields.promo_panel.add' defaultMessage='Add new Promo panel item' />
                    </div>
                  </div>
                </div>
                <div className='input with_block_label'>
                  <label><FormattedMessage id='soapbox_settings.fields.home_footer_fields_label' defaultMessage='Home footer items' /></label>
                  <span className='hint'>
                    <FormattedMessage id='soapbox_settings.hints.home_footer_fields' defaultMessage='You can have custom defined links displayed on the footer of your static pages' />
                  </span>
                  {
                    homeFooterItems.valueSeq().map((field, i) => (
                    // homeFooterItems.map((field, i) => (
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
                    <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddHomeFooterItem}>
                      <FormattedMessage id='soapbox_settings.fields.home_footer.add' defaultMessage='Add new Home Footer Item' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='input with_block_label'>
                <label><FormattedMessage id='soapbox_settings.fields.custom_css_fields_label' defaultMessage='Custom CSS' /></label>
                <span className='hint'>
                  <FormattedMessage id='soapbox_settings.hints.custom_css_fields' defaultMessage='You can have custom CSS definitions' />
                </span>
                {
                  customCssItems.valueSeq().map((field, i) => (
                  // customCssItems.map((field, i) => (
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
                  <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddCssItem}>
                    <FormattedMessage id='soapbox_settings.fields.custom_css.add' defaultMessage='Add new Custom CSS item' />
                  </div>
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
