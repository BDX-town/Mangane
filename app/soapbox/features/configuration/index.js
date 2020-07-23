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
import { unescape } from 'lodash';
import { generateThemeCss } from 'soapbox/utils/theme';

const MAX_FIELDS = 6; // Max promoPanel fields

const messages = defineMessages({
  heading: { id: 'column.soapbox_settings', defaultMessage: 'Soapbox settings' },
  promoPanelIcon: { id: 'soapbox_settings.promo_panel.meta_fields.icon_placeholder', defaultMessage: 'Icon' },
  promoPanelLabel: { id: 'soapbox_settings.promo_panel.meta_fields.label_placeholder', defaultMessage: 'Label' },
  promoPanelURL: { id: 'soapbox_settings.promo_panel.meta_fields.url_placeholder', defaultMessage: 'URL' },
  homeFooterLabel: { id: 'soapbox_settings.home_footer.meta_fields.label_placeholder', defaultMessage: 'Label' },
  homeFooterURL: { id: 'soapbox_settings.home_footer.meta_fields.url_placeholder', defaultMessage: 'URL' },
});

const mapStateToProps = state => {
  const soapbox = state.get('soapbox');
  console.log(soapbox);
  console.log(generateThemeCss(soapbox.get('brandColor')));
  console.log(soapbox.get('logo'));
  console.log(soapbox.get('promoPanel'));
  console.log(soapbox.get('extensions'));
  console.log(soapbox.get('defaultSettings'));
  console.log(soapbox.get('copyright'));
  console.log(soapbox.get('navLinks'));
  return {
    themeCss: generateThemeCss(soapbox.get('brandColor')),
    logo: soapbox.get('logo'),
    promoPanel: soapbox.get('promoPanel'),
    patronEnabled: soapbox.get('extensions'),
    autoPlayGif: soapbox.get('defaultSettings'),
    copyright: soapbox.get('copyright'),
    homeFooter: soapbox.get('navLinks'),
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
    promoPanel: ImmutablePropTypes.map,
    patronEnabled: PropTypes.object,
    autoPlayGif: PropTypes.object,
    copyright: PropTypes.string,
    homeFooter: ImmutablePropTypes.map,
  };

  state = {
    isLoading: false,
    // promoPanel: normalizeFields(Array.from({ length: MAX_FIELDS })),
  }

  // makePreviewLogo = () => {
  //   const { logo } = this.props;
  //   return logo.merge(ImmutableMap({
  //     header: this.state.header,
  //     avatar: this.state.avatar,
  //     display_name: this.state.display_name,
  //   }));
  // }

  getPromoPanelParams = () => {
    let params = ImmutableMap();
    this.state.promoPanel.forEach((f, i) =>
      params = params
        .set(`promo_panel_attributes[${i}][name]`,  f.get('name'))
        .set(`promo_panel_attributes[${i}][value]`, f.get('value'))
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
      homeFooter: state.homeFooter,
    }, this.getPromoPanelParams().toJS());
  }

  getFormdata = () => {
    const data = this.getParams();
    let formData = new FormData();
    for (let key in data) {
      const shouldAppend = Boolean(data[key] || key.startsWith('promo_panel_attributes'));
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

  handlePromoPanelChange = (i, key) => {
    return (e) => {
      this.setState({
        promoPanel: this.state.promoPanel.setIn([i, key], e.target.value),
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
              <TextInput
                label={<FormattedMessage id='soapbox_settings.fields.display_name_label' defaultMessage='Display name' />}
                name='display_name'
                value={this.state.display_name}
                onChange={this.handleTextChange}
              />
              <TextInput
                label={<FormattedMessage id='soapbox_settings.fields.bio_label' defaultMessage='Bio' />}
                name='note'
                value={this.state.note}
                onChange={this.handleTextChange}
              />
              <div className='fields-row'>
                <div className='fields-row__column fields-row__column-6'>
                  <StillImage src={this.state.logo} />
                </div>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooser
                    label={<FormattedMessage id='soapbox_settings.fields.header_label' defaultMessage='Header' />}
                    name='header'
                    hint={<FormattedMessage id='soapbox_settings.hints.header' defaultMessage='PNG, GIF or JPG. At most 2 MB. Will be downscaled to 1500x500px' />}
                    onChange={this.handleFileChange}
                  />
                  <FileChooser
                    label={<FormattedMessage id='soapbox_settings.fields.avatar_label' defaultMessage='Avatar' />}
                    name='avatar'
                    hint={<FormattedMessage id='soapbox_settings.hints.avatar' defaultMessage='PNG, GIF or JPG. At most 2 MB. Will be downscaled to 400x400px' />}
                    onChange={this.handleFileChange}
                  />
                </div>
              </div>
              <Checkbox
                label={<FormattedMessage id='soapbox_settings.fields.locked_label' defaultMessage='Lock account' />}
                hint={<FormattedMessage id='soapbox_settings.hints.locked' defaultMessage='Requires you to manually approve followers' />}
                name='locked'
                checked={this.state.locked}
                onChange={this.handleCheckboxChange}
              />
              <Checkbox
                label={<FormattedMessage id='soapbox_settings.fields.bot_label' defaultMessage='This is a bot account' />}
                hint={<FormattedMessage id='soapbox_settings.hints.bot' defaultMessage='This account mainly performs automated actions and might not be monitored' />}
                name='bot'
                checked={this.state.bot}
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
                    this.state.promoPanel.map((field, i) => (
                      <div className='row' key={i}>
                        <TextInput
                          placeholder={intl.formatMessage(messages.metaFieldLabel)}
                          value={field.get('name')}
                          onChange={this.handlePromoPanelChange(i, 'name')}
                        />
                        <TextInput
                          placeholder={intl.formatMessage(messages.metaFieldContent)}
                          value={field.get('value')}
                          onChange={this.handlePromoPanelChange(i, 'value')}
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
