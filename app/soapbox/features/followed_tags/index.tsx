import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchFilters, createFilter, deleteFilter } from 'soapbox/actions/filters';
import snackbar from 'soapbox/actions/snackbar';
import Icon from 'soapbox/components/icon';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Button, CardHeader, CardTitle, Column, Form, FormActions, FormGroup, Input, Text } from 'soapbox/components/ui';
import {
  FieldsGroup,
  Checkbox,
} from 'soapbox/features/forms';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  heading: { id: 'column.tags', defaultMessage: 'Followed hashtags' },
});

const FollowedHashtags = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();


  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey='followed_hashtags'
        emptyMessage={<FormattedMessage id='column.tags.empty' defaultMessage="You don't follow any hashtag yet." />}
      >
        Bonjour
      </ScrollableList>
    </Column>
  );
};

export default FollowedHashtags;
