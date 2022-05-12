import React from 'react';
import { useEffect } from 'react';
import { defineMessages, FormattedDate, useIntl } from 'react-intl';

import { fetchOAuthTokens, revokeOAuthTokenById } from 'soapbox/actions/security';
import { Button, Card, CardBody, CardHeader, CardTitle, Column, Spinner, Stack, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { Token } from 'soapbox/reducers/security';

const messages = defineMessages({
  header: { id: 'security.headers.tokens', defaultMessage: 'Sessions' },
  revoke: { id: 'security.tokens.revoke', defaultMessage: 'Revoke' },
});

interface IAuthToken {
  token: Token,
}

const AuthToken: React.FC<IAuthToken> = ({ token }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const handleRevoke = () => {
    dispatch(revokeOAuthTokenById(token.id));
  };

  return (
    <div className='p-4 rounded-lg bg-gray-100 dark:bg-slate-700'>
      <Stack space={2}>
        <Stack>
          <Text size='md' weight='medium'>{token.app_name}</Text>
          <Text size='sm' theme='muted'>
            <FormattedDate
              value={new Date(token.valid_until)}
              hour12={false}
              year='numeric'
              month='short'
              day='2-digit'
              hour='2-digit'
              minute='2-digit'
            />
          </Text>
        </Stack>

        <div className='flex justify-end'>
          <Button theme='primary' onClick={handleRevoke}>
            {intl.formatMessage(messages.revoke)}
          </Button>
        </div>
      </Stack>
    </div>
  );
};

const AuthTokenList: React.FC = () =>{
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const tokens = useAppSelector(state => state.security.get('tokens'));

  useEffect(() => {
    dispatch(fetchOAuthTokens());
  }, []);

  const body = tokens ? (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {tokens.map((token) => (
        <AuthToken key={token.id} token={token} />
      ))}
    </div>
  ) : <Spinner />;

  return (
    <Column label={intl.formatMessage(messages.header)} transparent withHeader={false}>
      <Card variant='rounded'>
        <CardHeader backHref='/settings'>
          <CardTitle title={intl.formatMessage(messages.header)} />
        </CardHeader>

        <CardBody>
          {body}
        </CardBody>
      </Card>
    </Column>
  );
};

export default AuthTokenList;
