import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl, FormattedMessage, FormatDateOptions } from 'react-intl';

import { Widget, Stack, HStack, Icon, Text } from 'soapbox/components/ui';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { CryptoAddress } from 'soapbox/features/ui/util/async-components';

import type { Account, Field } from 'soapbox/types/entities';

const getTicker = (value: string): string => (value.match(/\$([a-zA-Z]*)/i) || [])[1];
const isTicker = (value: string): boolean => Boolean(getTicker(value));

const messages = defineMessages({
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  deactivated: { id: 'account.deactivated', defaultMessage: 'Deactivated' },
  bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },
});

const dateFormatOptions: FormatDateOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
};

interface IProfileField {
  field: Field,
}

/** Renders a single profile field. */
const ProfileField: React.FC<IProfileField> = ({ field }) => {
  const intl = useIntl();

  if (isTicker(field.name)) {
    return (
      <BundleContainer fetchComponent={CryptoAddress}>
        {Component => (
          <Component
            ticker={getTicker(field.name).toLowerCase()}
            address={field.value_plain}
          />
        )}
      </BundleContainer>
    );
  }

  return (
    <dl>
      <dt title={field.name}>
        <Text weight='bold' tag='span' dangerouslySetInnerHTML={{ __html: field.name_emojified }} />
      </dt>

      <dd
        className={classNames({ 'text-success-500': field.verified_at })}
        title={field.value_plain}
      >
        <HStack space={2} alignItems='center'>
          {field.verified_at && (
            <span className='flex-none' title={intl.formatMessage(messages.linkVerifiedOn, { date: intl.formatDate(field.verified_at, dateFormatOptions) })}>
              <Icon src={require('@tabler/icons/icons/check.svg')} />
            </span>
          )}

          <Text tag='span' dangerouslySetInnerHTML={{ __html: field.value_emojified }} />
        </HStack>
      </dd>
    </dl>
  );
};

interface IProfileFieldsPanel {
  account: Account,
}

/** Custom profile fields for sidebar. */
const ProfileFieldsPanel: React.FC<IProfileFieldsPanel> = ({ account }) => {
  return (
    <Widget title={<FormattedMessage id='profile_fields_panel.title' defaultMessage='Profile fields' />}>
      <Stack space={4}>
        {account.fields.map((field, i) => (
          <ProfileField field={field} key={i} />
        ))}
      </Stack>
    </Widget>
  );
};

export default ProfileFieldsPanel;
