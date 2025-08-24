import { OrderedSet } from 'immutable';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import Toggle from 'react-toggle';

import { changeReportBlock, changeReportForward } from 'soapbox/actions/reports';
import { fetchRules } from 'soapbox/actions/rules';
import { Button, FormGroup, HStack, Stack, Text } from 'soapbox/components/ui';
import StatusCheckBox from 'soapbox/features/report/components/status_check_box';
import { useAppSelector, useFeatures } from 'soapbox/hooks';
import { isRemote, getDomain } from 'soapbox/utils/accounts';

import type { ReducerAccount } from 'soapbox/reducers/accounts';

const messages = defineMessages({
  addAdditionalStatuses: { id: 'report.otherActions.addAdditionl', defaultMessage: 'Would you like to add additional statuses to this report?' },
  addMore: { id: 'report.otherActions.addMore', defaultMessage: 'Add more' },
  furtherActions: { id: 'report.otherActions.furtherActions', defaultMessage: 'Further actions:' },
  hideAdditonalStatuses: { id: 'report.otherActions.hideAdditional', defaultMessage: 'Hide additional statuses' },
  otherStatuses: { id: 'report.otherActions.otherStatuses', defaultMessage: 'Include other statuses?' },
});

interface IOtherActionsStep {
  account: ReducerAccount
}

const OtherActionsStep = ({ account }: IOtherActionsStep) => {
  const dispatch = useDispatch();
  const features = useFeatures();
  const intl = useIntl();

  const selectedStatusIds = useAppSelector((state) => state.reports.new.status_ids);
  const statusIds = useAppSelector((state) => OrderedSet(state.timelines.get(`account:${account.id}:with_replies`)!.items).union(state.reports.new.status_ids) as OrderedSet<string>);
  const isBlocked = useAppSelector((state) => state.reports.new.block);
  const isForward = useAppSelector((state) => state.reports.new.forward);
  const canForward = isRemote(account) && features.federating;
  const isSubmitting = useAppSelector((state) => state.reports.new.isSubmitting);

  const [showAdditionalStatuses, setShowAdditionalStatuses] = useState<boolean>(false);

  const handleBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportBlock(event.target.checked));
  };

  const handleForwardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportForward(event.target.checked));
  };

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch]);

  return (
    <Stack space={4}>
      {features.reportMultipleStatuses && (
        <Stack space={2}>
          <Text tag='h1' size='xl' weight='semibold'>
            {intl.formatMessage(messages.otherStatuses)}
          </Text>

          <FormGroup labelText={intl.formatMessage(messages.addAdditionalStatuses)}>
            {showAdditionalStatuses ? (
              <Stack space={2}>
                <div className='flex flex-col gap-4'>
                  {statusIds.map((statusId) => <StatusCheckBox id={statusId} disabled={statusId === selectedStatusIds.first()} key={statusId} />)}
                </div>

                <div>
                  <Button
                    icon={require('@tabler/icons/arrows-minimize.svg')}
                    theme='secondary'
                    size='sm'
                    onClick={() => setShowAdditionalStatuses(false)}
                  >
                    {intl.formatMessage(messages.hideAdditonalStatuses)}
                  </Button>
                </div>
              </Stack>
            ) : (
              <Button
                icon={require('@tabler/icons/plus.svg')}
                theme='secondary'
                size='sm'
                onClick={() => setShowAdditionalStatuses(true)}
              >
                {intl.formatMessage(messages.addMore)}
              </Button>
            )}
          </FormGroup>
        </Stack>
      )}

      <Stack space={2}>
        <Text tag='h1' size='xl' weight='semibold'>
          {intl.formatMessage(messages.furtherActions)}
        </Text>

        <FormGroup
          labelText={<FormattedMessage id='report.block_hint' defaultMessage='Do you also want to block this account?' />}
        >
          <HStack space={2} alignItems='center'>
            <Toggle
              checked={isBlocked}
              onChange={handleBlockChange}
              icons={false}
              id='report-block'
            />

            <Text theme='muted' tag='label' size='sm' htmlFor='report-block'>
              <FormattedMessage id='report.block' defaultMessage='Block {target}' values={{ target: `@${account.get('acct')}` }} />
            </Text>
          </HStack>
        </FormGroup>

        {canForward && (
          <FormGroup
            labelText={<FormattedMessage id='report.forward_hint' defaultMessage='The account is from another server. Send a copy of the report there as well?' />}
          >
            <HStack space={2} alignItems='center'>
              <Toggle
                checked={isForward}
                onChange={handleForwardChange}
                icons={false}
                id='report-forward'
                disabled={isSubmitting}
              />

              <Text theme='muted' tag='label' size='sm' htmlFor='report-forward'>
                <FormattedMessage id='report.forward' defaultMessage='Forward to {target}' values={{ target: getDomain(account) }} />
              </Text>
            </HStack>
          </FormGroup>
        )}
      </Stack>
    </Stack>
  );
};

export default OtherActionsStep;
