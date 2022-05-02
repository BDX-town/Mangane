import React from 'react';

import { Stack, Text } from 'soapbox/components/ui';

import type { ReducerAccount } from 'soapbox/reducers/accounts';

interface IOtherActionsStep {
  account: ReducerAccount
}

const ConfirmationStep = ({ account }: IOtherActionsStep) => {
  return (
    <Stack space={1}>
      <Text weight='semibold' tag='h1' size='xl'>
        Thanks for submitting your report.
      </Text>

      <Text>
        If we find that this account is violating the TRUTH Terms of Service we
        will take further action on the matter.
      </Text>
    </Stack>
  );
};

export default ConfirmationStep;
