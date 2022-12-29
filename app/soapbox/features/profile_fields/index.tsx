import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { fetchAccountByUsername } from 'soapbox/actions/accounts';
import MissingIndicator from 'soapbox/components/missing_indicator';
import { Card } from 'soapbox/components/ui';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  ProfileFieldsPanel,
} from 'soapbox/features/ui/util/async-components';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { findAccountByUsername } from 'soapbox/selectors';



const ProfileFields = () => {
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();

  const account = useAppSelector(state => {
    const account = findAccountByUsername(state, username);
    if (!account) {
      dispatch(fetchAccountByUsername(username));
    }
    return account;
  });

  const isAccount = useAppSelector(state => !!state.getIn(['accounts', account?.id]));


  if (!isAccount) {
    return (
      <MissingIndicator />
    );
  }

  return (
    account.fields.isEmpty() ? (
      <div className='mt-2'>
        <Card variant='rounded' size='lg'>
          <FormattedMessage id='account.no_fields' defaultMessage='This section is empty for now.' />
        </Card>
      </div>
    ) : (
      <BundleContainer fetchComponent={ProfileFieldsPanel}>
        {Component => <Component account={account} />}
      </BundleContainer>
    )
  );
};

export default ProfileFields;