'use strict';

import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Widget, Stack } from 'soapbox/components/ui';

import type { Account } from 'soapbox/types/entities';

interface IProfileFieldsPanel {
  account: Account,
}

/** Custom profile fields for sidebar. */
const ProfileFieldsPanel: React.FC<IProfileFieldsPanel> = ({ account }) => {
  return (
    <Widget title={<FormattedMessage id='profile_fields_panel.title' defaultMessage='Profile fields' />}>
      <Stack space={2}>
        {account.fields.map(field => (
          <div>
            {field.name_emojified}<br />
            {field.value_emojified}
          </div>
        ))}
      </Stack>
    </Widget>
  );
};

export default ProfileFieldsPanel;
