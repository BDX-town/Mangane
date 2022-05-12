import React, { useState, useEffect, useMemo } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { updateNotificationSettings } from 'soapbox/actions/accounts';
import { patchMe } from 'soapbox/actions/me';
import snackbar from 'soapbox/actions/snackbar';
import List, { ListItem } from 'soapbox/components/list';
import { useAppSelector, useAppDispatch, useOwnAccount, useFeatures } from 'soapbox/hooks';
import { normalizeAccount } from 'soapbox/normalizers';
import resizeImage from 'soapbox/utils/resize_image';

import { Button, Column, Form, FormActions, FormGroup, Input, Textarea, HStack, Toggle } from '../../components/ui';
import Streamfield, { StreamfieldComponent } from '../../components/ui/streamfield/streamfield';

import ProfilePreview from './components/profile-preview';

import type { Account } from 'soapbox/types/entities';

/**
 * Whether the user is hiding their follows and/or followers.
 * Pleroma's config is granular, but we simplify it into one setting.
 */
const hidesNetwork = (account: Account): boolean => {
  const { hide_followers, hide_follows, hide_followers_count, hide_follows_count } = account.pleroma.toJS();
  return Boolean(hide_followers && hide_follows && hide_followers_count && hide_follows_count);
};

/** Converts JSON objects to FormData. */
// https://stackoverflow.com/a/60286175/8811886
// @ts-ignore
const toFormData = (f => f(f))(h => f => f(x => h(h)(f)(x)))(f => fd => pk => d => {
  if (d instanceof Object) {
    // eslint-disable-next-line consistent-return
    Object.keys(d).forEach(k => {
      const v = d[k];
      if (pk) k = `${pk}[${k}]`;
      if (v instanceof Object && !(v instanceof Date) && !(v instanceof File)) {
        return f(fd)(k)(v);
      } else {
        fd.append(k, v);
      }
    });
  }
  return fd;
})(new FormData())();

const messages = defineMessages({
  heading: { id: 'column.edit_profile', defaultMessage: 'Edit profile' },
  header: { id: 'edit_profile.header', defaultMessage: 'Edit Profile' },
  metaFieldLabel: { id: 'edit_profile.fields.meta_fields.label_placeholder', defaultMessage: 'Label' },
  metaFieldContent: { id: 'edit_profile.fields.meta_fields.content_placeholder', defaultMessage: 'Content' },
  success: { id: 'edit_profile.success', defaultMessage: 'Profile saved!' },
  error: { id: 'edit_profile.error', defaultMessage: 'Profile update failed' },
  bioPlaceholder: { id: 'edit_profile.fields.bio_placeholder', defaultMessage: 'Tell us about yourself.' },
  displayNamePlaceholder: { id: 'edit_profile.fields.display_name_placeholder', defaultMessage: 'Name' },
  websitePlaceholder: { id: 'edit_profile.fields.website_placeholder', defaultMessage: 'Display a Link' },
  locationPlaceholder: { id: 'edit_profile.fields.location_placeholder', defaultMessage: 'Location' },
  cancel: { id: 'common.cancel', defaultMessage: 'Cancel' },
});

/**
 * Profile metadata `name` and `value`.
 * (By default, max 4 fields and 255 characters per property/value)
 */
interface AccountCredentialsField {
  name: string,
  value: string,
}

/** Private information (settings) for the account. */
interface AccountCredentialsSource {
  /** Default post privacy for authored statuses. */
  privacy?: string,
  /** Whether to mark authored statuses as sensitive by default. */
  sensitive?: boolean,
  /** Default language to use for authored statuses. (ISO 6391) */
  language?: string,
}

/**
 * Params to submit when updating an account.
 * @see PATCH /api/v1/accounts/update_credentials
 */
interface AccountCredentials {
  /** Whether the account should be shown in the profile directory. */
  discoverable?: boolean,
  /** Whether the account has a bot flag. */
  bot?: boolean,
  /** The display name to use for the profile. */
  display_name?: string,
  /** The account bio. */
  note?: string,
  /** Avatar image encoded using multipart/form-data */
  avatar?: File,
  /** Header image encoded using multipart/form-data */
  header?: File,
  /** Whether manual approval of follow requests is required. */
  locked?: boolean,
  /** Private information (settings) about the account. */
  source?: AccountCredentialsSource,
  /** Custom profile fields. */
  fields_attributes?: AccountCredentialsField[],

  // Non-Mastodon fields
  /** Pleroma: whether to accept notifications from people you don't follow. */
  stranger_notifications?: boolean,
  /** Soapbox BE: whether the user opts-in to email communications. */
  accepts_email_list?: boolean,
  /** Pleroma: whether to publicly display followers. */
  hide_followers?: boolean,
  /** Pleroma: whether to publicly display follows. */
  hide_follows?: boolean,
  /** Pleroma: whether to publicly display follower count. */
  hide_followers_count?: boolean,
  /** Pleroma: whether to publicly display follows count. */
  hide_follows_count?: boolean,
  /** User's website URL. */
  website?: string,
  /** User's location. */
  location?: string,
  /** User's birthday. */
  birthday?: string,
}

/** Convert an account into an update_credentials request object. */
const accountToCredentials = (account: Account): AccountCredentials => {
  const hideNetwork = hidesNetwork(account);

  return {
    discoverable: account.discoverable,
    bot: account.bot,
    display_name: account.display_name,
    note: account.source.get('note'),
    locked: account.locked,
    fields_attributes: [...account.source.get<Iterable<AccountCredentialsField>>('fields', []).toJS()],
    stranger_notifications: account.getIn(['pleroma', 'notification_settings', 'block_from_strangers']) === true,
    accepts_email_list: account.getIn(['pleroma', 'accepts_email_list']) === true,
    hide_followers: hideNetwork,
    hide_follows: hideNetwork,
    hide_followers_count: hideNetwork,
    hide_follows_count: hideNetwork,
    website: account.website,
    location: account.location,
    birthday: account.birthday,
  };
};

const ProfileField: StreamfieldComponent<AccountCredentialsField> = ({ value, onChange }) => {
  const intl = useIntl();

  const handleChange = (key: string): React.ChangeEventHandler<HTMLInputElement> => {
    return e => {
      onChange({ ...value, [key]: e.currentTarget.value });
    };
  };

  return (
    <HStack space={2} grow>
      <Input
        type='text'
        outerClassName='w-2/5 flex-grow'
        value={value.name}
        onChange={handleChange('name')}
        placeholder={intl.formatMessage(messages.metaFieldLabel)}
      />
      <Input
        type='text'
        outerClassName='w-3/5 flex-grow'
        value={value.value}
        onChange={handleChange('value')}
        placeholder={intl.formatMessage(messages.metaFieldContent)}
      />
    </HStack>
  );
};

/** Edit profile page. */
const EditProfile: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const account   = useOwnAccount();
  const features  = useFeatures();
  const maxFields = useAppSelector(state => state.instance.pleroma.getIn(['metadata', 'fields_limits', 'max_fields'], 4) as number);

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<AccountCredentials>({});
  const [muteStrangers, setMuteStrangers] = useState(false);

  useEffect(() => {
    if (account) {
      const credentials = accountToCredentials(account);
      const strangerNotifications = account.getIn(['pleroma', 'notification_settings', 'block_from_strangers']) === true;
      setData(credentials);
      setMuteStrangers(strangerNotifications);
    }
  }, [account?.id]);

  /** Set a single key in the request data. */
  const updateData = (key: string, value: any) => {
    setData(prevData => {
      return { ...prevData, [key]: value };
    });
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    const promises = [];
    const formData = toFormData(data);

    promises.push(dispatch(patchMe(formData)));

    if (features.muteStrangers) {
      promises.push(
        dispatch(updateNotificationSettings({
          block_from_strangers: muteStrangers,
        })).catch(console.error),
      );
    }

    setLoading(true);

    Promise.all(promises).then(() => {
      setLoading(false);
      dispatch(snackbar.success(intl.formatMessage(messages.success)));
    }).catch(() => {
      setLoading(false);
      dispatch(snackbar.error(intl.formatMessage(messages.error)));
    });

    event.preventDefault();
  };

  const handleCheckboxChange = (key: keyof AccountCredentials): React.ChangeEventHandler<HTMLInputElement> => {
    return e => {
      updateData(key, e.target.checked);
    };
  };

  const handleTextChange = (key: keyof AccountCredentials): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> => {
    return e => {
      updateData(key, e.target.value);
    };
  };

  const handleHideNetworkChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const hide = e.target.checked;

    setData(prevData => {
      return {
        ...prevData,
        hide_followers: hide,
        hide_follows: hide,
        hide_followers_count: hide,
        hide_follows_count: hide,
      };
    });
  };

  const handleFileChange = (
    name: keyof AccountCredentials,
    maxPixels: number,
  ): React.ChangeEventHandler<HTMLInputElement> => {
    return e => {
      const f = e.target.files?.item(0);
      if (!f) return;

      resizeImage(f, maxPixels).then(file => {
        updateData(name, file);
      }).catch(console.error);
    };
  };

  const handleFieldsChange = (fields: AccountCredentialsField[]) => {
    updateData('fields_attributes', fields);
  };

  const handleAddField = () => {
    const oldFields = data.fields_attributes || [];
    const fields = [...oldFields, { name: '', value: '' }];
    updateData('fields_attributes', fields);
  };

  const handleRemoveField = (i: number) => {
    const oldFields = data.fields_attributes || [];
    const fields = [...oldFields];
    fields.splice(i, 1);
    updateData('fields_attributes', fields);
  };

  /** Memoized avatar preview URL. */
  const avatarUrl = useMemo(() => {
    return data.avatar ? URL.createObjectURL(data.avatar) : account?.avatar;
  }, [data.avatar, account?.avatar]);

  /** Memoized header preview URL. */
  const headerUrl = useMemo(() => {
    return data.header ? URL.createObjectURL(data.header) : account?.header;
  }, [data.header, account?.header]);

  /** Preview account data. */
  const previewAccount = useMemo(() => {
    return normalizeAccount({
      ...account?.toJS(),
      ...data,
      avatar: avatarUrl,
      header: headerUrl,
    }) as Account;
  }, [account?.id, data.display_name, avatarUrl, headerUrl]);

  return (
    <Column label={intl.formatMessage(messages.header)}>
      <Form onSubmit={handleSubmit}>
        <FormGroup
          labelText={<FormattedMessage id='edit_profile.fields.display_name_label' defaultMessage='Display name' />}
        >
          <Input
            type='text'
            value={data.display_name}
            onChange={handleTextChange('display_name')}
            placeholder={intl.formatMessage(messages.displayNamePlaceholder)}
          />
        </FormGroup>

        {features.birthdays && (
          <FormGroup
            labelText={<FormattedMessage id='edit_profile.fields.birthday_label' defaultMessage='Birthday' />}
          >
            <Input
              type='text'
              value={data.birthday}
              onChange={handleTextChange('birthday')}
            />
          </FormGroup>
        )}

        {features.accountLocation && (
          <FormGroup
            labelText={<FormattedMessage id='edit_profile.fields.location_label' defaultMessage='Location' />}
          >
            <Input
              type='text'
              value={data.location}
              onChange={handleTextChange('location')}
              placeholder={intl.formatMessage(messages.locationPlaceholder)}
            />
          </FormGroup>
        )}

        {features.accountWebsite && (
          <FormGroup
            labelText={<FormattedMessage id='edit_profile.fields.website_label' defaultMessage='Website' />}
          >
            <Input
              type='text'
              value={data.website}
              onChange={handleTextChange('website')}
              placeholder={intl.formatMessage(messages.websitePlaceholder)}
            />
          </FormGroup>
        )}

        <FormGroup
          labelText={<FormattedMessage id='edit_profile.fields.bio_label' defaultMessage='Bio' />}
        >
          <Textarea
            value={data.note}
            onChange={handleTextChange('note')}
            autoComplete='off'
            placeholder={intl.formatMessage(messages.bioPlaceholder)}
          />
        </FormGroup>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ProfilePreview account={previewAccount} />

          <div className='space-y-4'>
            <FormGroup
              labelText={<FormattedMessage id='edit_profile.fields.header_label' defaultMessage='Choose Background Picture' />}
              hintText={<FormattedMessage id='edit_profile.hints.header' defaultMessage='PNG, GIF or JPG. Will be downscaled to {size}' values={{ size: '1920x1080px' }} />}
            >
              <input type='file' onChange={handleFileChange('header', 1920 * 1080)} className='text-sm' />
            </FormGroup>

            <FormGroup
              labelText={<FormattedMessage id='edit_profile.fields.avatar_label' defaultMessage='Choose Profile Picture' />}
              hintText={<FormattedMessage id='edit_profile.hints.avatar' defaultMessage='PNG, GIF or JPG. Will be downscaled to {size}' values={{ size: '400x400px' }} />}
            >
              <input type='file' onChange={handleFileChange('avatar', 400 * 400)} className='text-sm' />
            </FormGroup>
          </div>
        </div>

        <List>
          {features.followRequests && (
            <ListItem
              label={<FormattedMessage id='edit_profile.fields.locked_label' defaultMessage='Lock account' />}
              hint={<FormattedMessage id='edit_profile.hints.locked' defaultMessage='Requires you to manually approve followers' />}
            >
              <Toggle
                checked={data.locked}
                onChange={handleCheckboxChange('locked')}
              />
            </ListItem>
          )}

          {features.hideNetwork && (
            <ListItem
              label={<FormattedMessage id='edit_profile.fields.hide_network_label' defaultMessage='Hide network' />}
              hint={<FormattedMessage id='edit_profile.hints.hide_network' defaultMessage='Who you follow and who follows you will not be shown on your profile' />}
            >
              <Toggle
                checked={account ? hidesNetwork(account) : false}
                onChange={handleHideNetworkChange}
              />
            </ListItem>
          )}

          {features.bots && (
            <ListItem
              label={<FormattedMessage id='edit_profile.fields.bot_label' defaultMessage='This is a bot account' />}
              hint={<FormattedMessage id='edit_profile.hints.bot' defaultMessage='This account mainly performs automated actions and might not be monitored' />}
            >
              <Toggle
                checked={data.bot}
                onChange={handleCheckboxChange('bot')}
              />
            </ListItem>
          )}

          {features.muteStrangers && (
            <ListItem
              label={<FormattedMessage id='edit_profile.fields.stranger_notifications_label' defaultMessage='Block notifications from strangers' />}
              hint={<FormattedMessage id='edit_profile.hints.stranger_notifications' defaultMessage='Only show notifications from people you follow' />}
            >
              <Toggle
                checked={muteStrangers}
                onChange={(e) => setMuteStrangers(e.target.checked)}
              />
            </ListItem>
          )}

          {features.profileDirectory && (
            <ListItem
              label={<FormattedMessage id='edit_profile.fields.discoverable_label' defaultMessage='Allow account discovery' />}
              hint={<FormattedMessage id='edit_profile.hints.discoverable' defaultMessage='Display account in profile directory and allow indexing by external services' />}
            >
              <Toggle
                checked={data.discoverable}
                onChange={handleCheckboxChange('discoverable')}
              />
            </ListItem>
          )}

          {features.emailList && (
            <ListItem
              label={<FormattedMessage id='edit_profile.fields.accepts_email_list_label' defaultMessage='Subscribe to newsletter' />}
              hint={<FormattedMessage id='edit_profile.hints.accepts_email_list' defaultMessage='Opt-in to news and marketing updates.' />}
            >
              <Toggle
                checked={data.accepts_email_list}
                onChange={handleCheckboxChange('accepts_email_list')}
              />
            </ListItem>
          )}
        </List>

        {features.profileFields && (
          <Streamfield
            label={<FormattedMessage id='edit_profile.fields.meta_fields_label' defaultMessage='Profile fields' />}
            hint={<FormattedMessage id='edit_profile.hints.meta_fields' defaultMessage='You can have up to {count, plural, one {# custom field} other {# custom fields}} displayed on your profile.' values={{ count: maxFields }} />}
            values={data.fields_attributes || []}
            onChange={handleFieldsChange}
            onAddItem={handleAddField}
            onRemoveItem={handleRemoveField}
            component={ProfileField}
            maxItems={maxFields}
          />
        )}

        <FormActions>
          <Button to='/settings' theme='ghost'>
            {intl.formatMessage(messages.cancel)}
          </Button>

          <Button theme='primary' type='submit' disabled={isLoading}>
            <FormattedMessage id='edit_profile.save' defaultMessage='Save' />
          </Button>
        </FormActions>
      </Form>
    </Column>
  );
};

export default EditProfile;
