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
} from 'soapbox/features/forms';
// import BrandingPreview from './components/branding_preview';
import StillImage from 'soapbox/components/still_image';
import {
  Map as ImmutableMap,
  // List as ImmutableList,
} from 'immutable';
import { patchMe } from 'soapbox/actions/me';
//import { unescape } from 'lodash';
import { generateThemeCss } from 'soapbox/utils/theme';

const messages = defineMessages({
  heading: { id: 'column.soapbox_settings', defaultMessage: 'Soapbox settings' },
  promoItemIcon: { id: 'soapbox_settings.promo_panel.meta_fields.icon_placeholder', defaultMessage: 'Icon' },
  promoItemLabel: { id: 'soapbox_settings.promo_panel.meta_fields.label_placeholder', defaultMessage: 'Label' },
  promoItemURL: { id: 'soapbox_settings.promo_panel.meta_fields.url_placeholder', defaultMessage: 'URL' },
  homeFooterItemLabel: { id: 'soapbox_settings.home_footer.meta_fields.label_placeholder', defaultMessage: 'Label' },
  homeFooterItemURL: { id: 'soapbox_settings.home_footer.meta_fields.url_placeholder', defaultMessage: 'URL' },
});

const mapStateToProps = state => {
  const soapbox = state.get('soapbox');
  console.log(soapbox);
  console.log(generateThemeCss(soapbox.get('brandColor')));
  console.log(soapbox.get('logo'));
  console.log(soapbox.getIn(['promoPanel', 'items']));
  console.log(soapbox.getIn(['extensions', 'patron']));
  console.log(soapbox.getIn(['defaultSettings', 'autoPlayGif']));
  console.log(soapbox.get('copyright'));
  console.log(soapbox.getIn(['navlinks', 'homeFooter']));
  return {
    themeCss: generateThemeCss(soapbox.get('brandColor')),
    logo: soapbox.get('logo'),
    promoItems: soapbox.getIn(['promoPanel', 'items']),
    patronEnabled: soapbox.getIn(['extensions', 'patron']),
    autoPlayGif: soapbox.getIn(['defaultSettings', 'autoPlayGif']),
    copyright: soapbox.get('copyright'),
    homeFooterItems: soapbox.getIn(['navlinks', 'homeFooter']),
  };
};

export default @connect(mapStateToProps)
// export default @connect()
@injectIntl
class ConfigSoapbox extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    themeCss: PropTypes.string,
    logo: PropTypes.string,
    promoItems: ImmutablePropTypes.list,
    patronEnabled: PropTypes.bool,
    autoPlayGif: PropTypes.bool,
    copyright: PropTypes.string,
    homeFooterItems: ImmutablePropTypes.list,
  };

  state = {
    isLoading: false,
  }

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     logo: props.themeCss,
  //   };
  // }

  // makePreviewLogo = () => {
  //   const { logo } = this.props;
  //   return logo.merge(ImmutableMap({
  //     header: this.state.header,
  //     avatar: this.state.avatar,
  //     display_name: this.state.display_name,
  //   }));
  // }

  getPromoItemsParams = () => {
    let params = ImmutableMap();
    this.state.promoItems.forEach((f, i) =>
      params = params
        .set(`promo_panel_attributes[${i}][name]`,  f.get('name'))
        .set(`promo_panel_attributes[${i}][value]`, f.get('value'))
    );
    return params;
  }

  getHomeFooterParams = () => {
    let params = ImmutableMap();
    this.state.homeFooterItems.forEach((f, i) =>
      params = params
        .set(`home_footer_attributes[${i}][name]`,  f.get('name'))
        .set(`home_footer_attributes[${i}][value]`, f.get('value'))
    );
    return params;
  }

  getParams = () => {
    const { state } = this;
    return Object.assign({
      themeCss: state.themeCss,
      logoFile: state.logoFile,
      patronEnabled: state.patronEnabled,
      displayMode: state.displayMode,
      copyright: state.copyright,
    },
    this.getHomeFooterParams().toJS(),
    this.getPromoItemsParams().toJS());
  }

  getFormdata = () => {
    const data = this.getParams();
    let formData = new FormData();
    for (let key in data) {
      const shouldAppend = Boolean(data[key] || key.startsWith('promo_panel_attributes') || key.startsWith('home_footer_attributes'));
      if (shouldAppend) formData.append(key, data[key] || '');
    }
    return formData;
  }

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    dispatch(patchMe(this.getFormdata())).then(() => {
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

  handleFileChange = e => {
    const { name } = e.target;
    const [file] = e.target.files || [];
    const url = file ? URL.createObjectURL(file) : this.state[name];

    this.setState({
      [name]: url,
      [`${name}_file`]: file,
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <Column icon='gears' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <FieldsGroup>
              <div className='fields-row'>
                <div className='fields-row__column fields-row__column-6'>
                  {this.state.logo ? (<StillImage src={this.state.logo} />) : (<StillImage src={this.props.logo} />)}
                </div>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooser
                    label={<FormattedMessage id='soapbox_settings.fields.logo_label' defaultMessage='Logo' />}
                    name='logo'
                    hint={<FormattedMessage id='soapbox_settings.hints.logo' defaultMessage='SVG. At most 2 MB. Will be downscaled to 50px height, maintaining aspect ratio' />}
                    onChange={this.handleFileChange}
                  />
                  <FileChooser
                    label={<FormattedMessage id='soapbox_settings.fields.banner_label' defaultMessage='Banner' />}
                    name='banner'
                    hint={<FormattedMessage id='soapbox_settings.hints.banner' defaultMessage='PNG, GIF or JPG. At most 2 MB. Will be downscaled to 400x400px' />}
                    onChange={this.handleFileChange}
                  />
                </div>
              </div>
              <Checkbox
                label={<FormattedMessage id='soapbox_settings.fields.patron_enabled_label' defaultMessage='Enable Patron module' />}
                hint={<FormattedMessage id='soapbox_settings.hints.patron_enabled' defaultMessage='Enables display of Patron module.  Requires installation of Patron module.' />}
                name='patron_enabled'
                checked={this.state.patronEnabled ? this.state.patronEnabled : this.props.patronEnabled}
                onChange={this.handleCheckboxChange}
              />
              <Checkbox
                label={<FormattedMessage id='soapbox_settings.fields.auto_play_gif_label' defaultMessage='Auto-play GIFs' />}
                hint={<FormattedMessage id='soapbox_settings.hints.auto_play_gif' defaultMessage='Enable auto-playing of GIF files in timeline' />}
                name='auto_play_gif'
                checked={this.state.autoPlayGif ? this.state.autoPlayGif : this.props.autoPlayGif}
                onChange={this.handleCheckboxChange}
              />
            </FieldsGroup>
            <FieldsGroup>
              <div className='fields-row__column fields-group'>
                <div className='input with_block_label'>
                  <label><FormattedMessage id='soapbox_settings.fields.meta_fields_label' defaultMessage='Profile metadata' /></label>
                  <span className='hint'>
                    <FormattedMessage id='soapbox_settings.hints.meta_fields' defaultMessage='You can have up to {count, plural, one {# item} other {# items}} displayed as a table on your profile' values={{ count: MAX_FIELDS }} />
                  </span>
                  {
                    this.state.promoItems.map((field, i) => (
                      <div className='row' key={i}>
                        <TextInput
                          placeholder={intl.formatMessage(messages.metaFieldLabel)}
                          value={field.get('name')}
                          onChange={this.handlePromoItemsChange(i, 'name')}
                        />
                        <TextInput
                          placeholder={intl.formatMessage(messages.metaFieldContent)}
                          value={field.get('value')}
                          onChange={this.handlePromoItemsChange(i, 'value')}
                        />
                      </div>
                    ))
                  }
                </div>
                <div className='input with_block_label'>
                  <label><FormattedMessage id='soapbox_settings.fields.meta_fields_label' defaultMessage='Profile metadata' /></label>
                  <span className='hint'>
                    <FormattedMessage id='soapbox_settings.hints.meta_fields' defaultMessage='You can have up to {count, plural, one {# item} other {# items}} displayed as a table on your profile' values={{ count: MAX_FIELDS }} />
                  </span>
                  {
                    this.state.homeFooterItems.map((field, i) => (
                      <div className='row' key={i}>
                        <TextInput
                          placeholder={intl.formatMessage(messages.metaFieldLabel)}
                          value={field.get('name')}
                          onChange={this.handleHomeFooterItemsChange(i, 'name')}
                        />
                        <TextInput
                          placeholder={intl.formatMessage(messages.metaFieldContent)}
                          value={field.get('value')}
                          onChange={this.handleHomeFooterItemsChange(i, 'value')}
                        />
                      </div>
                    ))
                  }
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
