import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';
import { unescape } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { updateNotificationSettings } from 'soapbox/actions/accounts';
import { patchMe } from 'soapbox/actions/me';
import snackbar from 'soapbox/actions/snackbar';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import BirthdayInput from 'soapbox/components/birthday_input';
import Icon from 'soapbox/components/icon';
import {
  SimpleForm,
  FieldsGroup,
  TextInput,
  Checkbox,
  FileChooser,
  SimpleTextarea,
} from 'soapbox/features/forms';
import { makeGetAccount } from 'soapbox/selectors';
import { getFeatures } from 'soapbox/utils/features';
import resizeImage from 'soapbox/utils/resize_image';

import Column from '../ui/components/column';

import ProfilePreview from './components/profile_preview';

const hidesNetwork = account => {
  const pleroma = account.get('pleroma');
  if (!pleroma) return false;

  const { hide_followers, hide_follows, hide_followers_count, hide_follows_count } = pleroma.toJS();
  return hide_followers && hide_follows && hide_followers_count && hide_follows_count;
};

const messages = defineMessages({
  heading: { id: 'column.edit_profile', defaultMessage: 'Edit profile' },
  metaFieldLabel: { id: 'edit_profile.fields.meta_fields.label_placeholder', defaultMessage: 'Label' },
  metaFieldContent: { id: 'edit_profile.fields.meta_fields.content_placeholder', defaultMessage: 'Content' },
  verified: { id: 'edit_profile.fields.verified_display_name', defaultMessage: 'Verified users may not update their display name' },
  success: { id: 'edit_profile.success', defaultMessage: 'Profile saved!' },
  error: { id: 'edit_profile.error', defaultMessage: 'Profile update failed' },
  bioPlaceholder: { id: 'edit_profile.fields.bio_placeholder', defaultMessage: 'Tell us about yourself.' },
  displayNamePlaceholder: { id: 'edit_profile.fields.display_name_placeholder', defaultMessage: 'Name' },
  view: { id: 'snackbar.view', defaultMessage: 'View' },
  birthdayPlaceholder: { id: 'edit_profile.fields.birthday_placeholder', defaultMessage: 'Your birthday' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = state => {
    const me = state.get('me');
    const account = getAccount(state, me);
    const soapbox = getSoapboxConfig(state);
    const features = getFeatures(state.get('instance'));

    return {
      account,
      maxFields: state.getIn(['instance', 'pleroma', 'metadata', 'fields_limits', 'max_fields'], 4),
      verifiedCanEditName: soapbox.get('verifiedCanEditName'),
      supportsEmailList: features.emailList,
      supportsBirthdays: features.birthdays,
    };
  };

  return mapStateToProps;
};

// Forces fields to be maxFields size, filling empty values
const normalizeFields = (fields, maxFields) => (
  ImmutableList(fields).setSize(Math.max(fields.size, maxFields)).map(field =>
    field ? field : ImmutableMap({ name: '', value: '' }),
  )
);

// HTML unescape for special chars, eg <br>
const unescapeParams = (map, params) => (
  params.reduce((map, param) => (
    map.set(param, unescape(map.get(param)))
  ), map)
);

export default @connect(makeMapStateToProps)
@injectIntl
class EditProfile extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    maxFields: PropTypes.number,
    verifiedCanEditName: PropTypes.bool,
    supportsEmailList: PropTypes.bool,
    supportsBirthdays: PropTypes.bool,
  };

  state = {
    isLoading: false,
  }

  constructor(props) {
    super(props);
    const { account, maxFields } = this.props;

    const strangerNotifications = account.getIn(['pleroma', 'notification_settings', 'block_from_strangers']);
    const acceptsEmailList = account.getIn(['pleroma', 'accepts_email_list']);
    const discoverable = account.getIn(['source', 'pleroma', 'discoverable']);
    const birthday = account.get('birthday');
    const showBirthday = account.getIn(['source', 'pleroma', 'show_birthday']);

    const initialState = ImmutableMap(account).withMutations(map => {
      map.merge(map.get('source'));
      map.delete('source');
      map.set('fields', normalizeFields(map.get('fields'), Math.min(maxFields, 4)));
      map.set('stranger_notifications', strangerNotifications);
      map.set('accepts_email_list', acceptsEmailList);
      map.set('hide_network', hidesNetwork(account));
      map.set('discoverable', discoverable);
      map.set('show_birthday', showBirthday);
      if (birthday) {
        const date = new Date(birthday);
        map.set('birthday', new Date(date.getTime() + (date.getTimezoneOffset() * 60000)));
      }
      unescapeParams(map, ['display_name', 'bio']);
    });

    this.state = initialState.toObject();
  }

  makePreviewAccount = () => {
    const { account } = this.props;
    return account.merge(ImmutableMap({
      header: this.state.header,
      avatar: this.state.avatar,
      display_name: this.state.display_name || account.get('username'),
    }));
  }

  getFieldParams = () => {
    let params = ImmutableMap();
    this.state.fields.forEach((f, i) =>
      params = params
        .set(`fields_attributes[${i}][name]`,  f.get('name'))
        .set(`fields_attributes[${i}][value]`, f.get('value')),
    );
    return params;
  }

  getParams = () => {
    const { state } = this;
    return Object.assign({
      discoverable: state.discoverable,
      bot: state.bot,
      display_name: state.display_name,
      note: state.note,
      avatar: state.avatar_file,
      header: state.header_file,
      locked: state.locked,
      accepts_email_list: state.accepts_email_list,
      hide_followers: state.hide_network,
      hide_follows: state.hide_network,
      hide_followers_count: state.hide_network,
      hide_follows_count: state.hide_network,
      birthday: state.birthday
        ? new Date(state.birthday.getTime() - (state.birthday.getTimezoneOffset() * 60000)).toISOString().slice(0, 10)
        : undefined,
      show_birthday: state.show_birthday,
    }, this.getFieldParams().toJS());
  }

  getFormdata = () => {
    const data = this.getParams();
    const formData = new FormData();
    for (const key in data) {
      // Compact the submission. This should probably be done better.
      const shouldAppend = Boolean(data[key] !== undefined || key.startsWith('fields_attributes'));
      if (shouldAppend) formData.append(key, data[key] || '');
    }
    return formData;
  }

  handleSubmit = (event) => {
    const { dispatch, intl, account } = this.props;

    const credentials = dispatch(patchMe(this.getFormdata()));
    const notifications = dispatch(updateNotificationSettings({
      block_from_strangers: this.state.stranger_notifications || false,
    }));

    this.setState({ isLoading: true });

    Promise.all([credentials, notifications]).then(() => {
      this.setState({ isLoading: false });
      dispatch(snackbar.success(intl.formatMessage(messages.success), intl.formatMessage(messages.view), `/@${account.get('acct')}`));
    }).catch((error) => {
      this.setState({ isLoading: false });
      dispatch(snackbar.error(intl.formatMessage(messages.error)));
    });

    event.preventDefault();
  }

  handleCheckboxChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFieldChange = (i, key) => {
    return (e) => {
      this.setState({
        fields: this.state.fields.setIn([i, key], e.target.value),
      });
    };
  }

  handleFileChange = maxPixels => {
    return e => {
      const { name } = e.target;
      const [f] = e.target.files || [];

      resizeImage(f, maxPixels).then(file => {
        const url = file ? URL.createObjectURL(file) : this.state[name];

        this.setState({
          [name]: url,
          [`${name}_file`]: file,
        });
      }).catch(console.error);
    };
  }

  handleBirthdayChange = birthday => {
    this.setState({
      birthday,
    });
  }

  handleAddField = () => {
    this.setState({
      fields: this.state.fields.push(ImmutableMap({ name: '', value: '' })),
    });
  }

  handleDeleteField = i => {
    return () => {
      this.setState({
        fields: normalizeFields(this.state.fields.delete(i), Math.min(this.props.maxFields, 4)),
      });
    };
  }

  render() {
    const { intl, maxFields, account, verifiedCanEditName, supportsBirthdays, supportsEmailList } = this.props;
    const verified = account.get('verified');
    const canEditName = verifiedCanEditName || !verified;

    return (
      <Column icon='user' heading={intl.formatMessage(messages.heading)}>
        <SimpleForm onSubmit={this.handleSubmit}>
          <fieldset disabled={this.state.isLoading}>
            <FieldsGroup>
              <TextInput
                className={canEditName ? '' : 'disabled'}
                label={<FormattedMessage id='edit_profile.fields.display_name_label' defaultMessage='Display name' />}
                placeholder={intl.formatMessage(messages.displayNamePlaceholder)}
                name='display_name'
                value={this.state.display_name}
                onChange={this.handleTextChange}
                disabled={!canEditName}
                hint={!canEditName && intl.formatMessage(messages.verified)}
              />
              <SimpleTextarea
                label={<FormattedMessage id='edit_profile.fields.bio_label' defaultMessage='Bio' />}
                placeholder={intl.formatMessage(messages.bioPlaceholder)}
                name='note'
                autoComplete='off'
                value={this.state.note}
                wrap='hard'
                onChange={this.handleTextChange}
                rows={3}
              />
              {supportsBirthdays && (
                <>
                  <BirthdayInput
                    hint={<FormattedMessage id='edit_profile.fields.birthday_label' defaultMessage='Birthday' />}
                    value={this.state.birthday}
                    onChange={this.handleBirthdayChange}
                  />
                  <Checkbox
                    label={<FormattedMessage id='edit_profile.fields.show_birthday_label' defaultMessage='Show my birthday' />}
                    hint={<FormattedMessage id='edit_profile.hints.show_birthday' defaultMessage='Your birthday will be visible on your profile.' />}
                    name='show_birthday'
                    checked={this.state.show_birthday}
                    onChange={this.handleCheckboxChange}
                  />
                </>
              )}
              <div className='fields-row'>
                <div className='fields-row__column fields-row__column-6'>
                  <ProfilePreview account={this.makePreviewAccount()} />
                </div>
                <div className='fields-row__column fields-group fields-row__column-6'>
                  <FileChooser
                    label={<FormattedMessage id='edit_profile.fields.header_label' defaultMessage='Header' />}
                    name='header'
                    hint={<FormattedMessage id='edit_profile.hints.header' defaultMessage='PNG, GIF or JPG. Will be downscaled to {size}' values={{ size: '1920x1080px' }} />}
                    onChange={this.handleFileChange(1920 * 1080)}
                  />
                  <FileChooser
                    label={<FormattedMessage id='edit_profile.fields.avatar_label' defaultMessage='Avatar' />}
                    name='avatar'
                    hint={<FormattedMessage id='edit_profile.hints.avatar' defaultMessage='PNG, GIF or JPG. Will be downscaled to {size}' values={{ size: '400x400px' }} />}
                    onChange={this.handleFileChange(400 * 400)}
                  />
                </div>
              </div>
              <Checkbox
                label={<FormattedMessage id='edit_profile.fields.locked_label' defaultMessage='Lock account' />}
                hint={<FormattedMessage id='edit_profile.hints.locked' defaultMessage='Requires you to manually approve followers' />}
                name='locked'
                checked={this.state.locked}
                onChange={this.handleCheckboxChange}
              />
              <Checkbox
                label={<FormattedMessage id='edit_profile.fields.hide_network_label' defaultMessage='Hide network' />}
                hint={<FormattedMessage id='edit_profile.hints.hide_network' defaultMessage='Who you follow and who follows you will not be shown on your profile' />}
                name='hide_network'
                checked={this.state.hide_network}
                onChange={this.handleCheckboxChange}
              />
              <Checkbox
                label={<FormattedMessage id='edit_profile.fields.bot_label' defaultMessage='This is a bot account' />}
                hint={<FormattedMessage id='edit_profile.hints.bot' defaultMessage='This account mainly performs automated actions and might not be monitored' />}
                name='bot'
                checked={this.state.bot}
                onChange={this.handleCheckboxChange}
              />
              <Checkbox
                label={<FormattedMessage id='edit_profile.fields.stranger_notifications_label' defaultMessage='Block notifications from strangers' />}
                hint={<FormattedMessage id='edit_profile.hints.stranger_notifications' defaultMessage='Only show notifications from people you follow' />}
                name='stranger_notifications'
                checked={this.state.stranger_notifications}
                onChange={this.handleCheckboxChange}
              />
              <Checkbox
                label={<FormattedMessage id='edit_profile.fields.discoverable_label' defaultMessage='Allow account discovery' />}
                hint={<FormattedMessage id='edit_profile.hints.discoverable' defaultMessage='Display account in profile directory and allow indexing by external services' />}
                name='discoverable'
                checked={this.state.discoverable}
                onChange={this.handleCheckboxChange}
              />
              {supportsEmailList && <Checkbox
                label={<FormattedMessage id='edit_profile.fields.accepts_email_list_label' defaultMessage='Subscribe to newsletter' />}
                hint={<FormattedMessage id='edit_profile.hints.accepts_email_list' defaultMessage='Opt-in to news and marketing updates.' />}
                name='accepts_email_list'
                checked={this.state.accepts_email_list}
                onChange={this.handleCheckboxChange}
              />}
            </FieldsGroup>
            <FieldsGroup>
              <div className='fields-row__column fields-group'>
                <div className='input with_block_label'>
                  <label><FormattedMessage id='edit_profile.fields.meta_fields_label' defaultMessage='Profile metadata' /></label>
                  <span className='hint'>
                    <FormattedMessage id='edit_profile.hints.meta_fields' defaultMessage='You can have up to {count, plural, one {# item} other {# items}} displayed as a table on your profile' values={{ count: maxFields }} />
                  </span>
                  {
                    this.state.fields.map((field, i) => (
                      <div className='row' key={i}>
                        <TextInput
                          placeholder={intl.formatMessage(messages.metaFieldLabel)}
                          value={field.get('name')}
                          onChange={this.handleFieldChange(i, 'name')}
                        />
                        <TextInput
                          placeholder={intl.formatMessage(messages.metaFieldContent)}
                          value={field.get('value')}
                          onChange={this.handleFieldChange(i, 'value')}
                        />
                        {
                          this.state.fields.size > 4 && <Icon className='delete-field' src={require('@tabler/icons/icons/circle-x.svg')} onClick={this.handleDeleteField(i)} />
                        }
                      </div>
                    ))
                  }
                  {
                    this.state.fields.size < maxFields && (
                      <div className='actions add-row'>
                        <div name='button' type='button' role='presentation' className='btn button button-secondary' onClick={this.handleAddField}>
                          <Icon src={require('@tabler/icons/icons/circle-plus.svg')} />
                          <FormattedMessage id='edit_profile.meta_fields.add' defaultMessage='Add new item' />
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
            </FieldsGroup>
          </fieldset>
          <div className='actions'>
            <button name='button' type='submit' className='btn button button-primary'>
              <FormattedMessage id='edit_profile.save' defaultMessage='Save' />
            </button>
          </div>
        </SimpleForm>
      </Column>
    );
  }

}
