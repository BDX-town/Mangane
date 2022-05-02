import { OrderedSet, Set as ImmutableSet } from 'immutable';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import Toggle from 'react-toggle';

import { changeReportBlock, changeReportForward } from 'soapbox/actions/reports';
import { fetchRules } from 'soapbox/actions/rules';
import AttachmentThumbs from 'soapbox/components/attachment_thumbs';
import StatusContent from 'soapbox/components/status_content';
import { Button, FormGroup, HStack, Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import StatusCheckBox from 'soapbox/features/report/containers/status_check_box_container';
import { useAppSelector, useFeatures } from 'soapbox/hooks';
import { isRemote, getDomain } from 'soapbox/utils/accounts';

import type { ReducerAccount } from 'soapbox/reducers/accounts';

const SelectedStatus = ({ statusId }: { statusId: string }) => {
  const status = useAppSelector((state) => state.statuses.get(statusId));

  if (!status) {
    return null;
  }

  return (
    <Stack space={2} className='p-4 rounded-lg bg-gray-100 dark:bg-slate-700'>
      <AccountContainer
        id={status.get('account') as any}
        showProfileHoverCard={false}
        timestamp={status.get('created_at')}
        hideActions
      />

      <StatusContent
        status={status}
        expanded
        collapsable
      />

      {status.get('media_attachments').size > 0 && (
        <AttachmentThumbs
          compact
          media={status.get('media_attachments')}
          sensitive={status.get('sensitive')}
        />
      )}
    </Stack>
  );
};

interface IOtherActionsStep {
  account: ReducerAccount
}

const OtherActionsStep = ({ account }: IOtherActionsStep) => {
  const dispatch = useDispatch();
  const features = useFeatures();

  const selectedStatusIds = useAppSelector((state) => state.reports.getIn(['new', 'status_ids']) as ImmutableSet<string>);
  const statusIds = useAppSelector((state) => OrderedSet(state.timelines.getIn([`account:${account.id}:with_replies`, 'items'])).union(state.reports.getIn(['new', 'status_ids']) as Iterable<unknown>) as OrderedSet<string>);
  const isBlocked = useAppSelector((state) => state.reports.getIn(['new', 'block']) as boolean);
  const isForward = useAppSelector((state) => state.reports.getIn(['reports', 'forward']) as boolean);
  const canForward = isRemote(account as any) && features.federating;
  const isSubmitting = useAppSelector((state) => state.reports.getIn(['new', 'isSubmitting']) as boolean);

  const [showAdditionalStatuses, setShowAdditionalStatuses] = useState<boolean>(false);

  const renderSelectedStatuses = useCallback(() => {
    switch (selectedStatusIds.size) {
    case 0:
      return (
        <div className='bg-gray-100 dark:bg-slate-700 p-4 rounded-lg flex items-center justify-center w-full'>
          <Text theme='muted'>You have removed all statuses from being selected.</Text>
        </div>
      );
    default:
      return <SelectedStatus statusId={selectedStatusIds.first()} />;
    }
  }, [selectedStatusIds.size]);

  const handleBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportBlock(event.target.checked));
  };

  const handleForwardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportForward(event.target.checked));
  };

  useEffect(() => {
    dispatch(fetchRules());
  }, []);

  return (
    <Stack space={4}>
      {renderSelectedStatuses()}

      {features.reportMultipleStatuses && (
        <Stack space={2}>
          <Text tag='h1' size='xl' weight='semibold'>Include other statuses?</Text>

          <FormGroup
            labelText='Would you like to add additional statuses to this report?'
          >
            {showAdditionalStatuses ? (
              <Stack space={2}>
                <div className='bg-gray-100 rounded-lg p-4'>
                  {statusIds.map((statusId) => <StatusCheckBox id={statusId} key={statusId} />)}
                </div>

                <div>
                  <Button
                    icon={require('@tabler/icons/icons/arrows-minimize.svg')}
                    theme='secondary'
                    size='sm'
                    onClick={() => setShowAdditionalStatuses(false)}
                  >
                    Hide additional statuses
                  </Button>
                </div>
              </Stack>
            ) : (
              <Button
                icon={require('@tabler/icons/icons/plus.svg')}
                theme='secondary'
                size='sm'
                onClick={() => setShowAdditionalStatuses(true)}
              >
                Add more
              </Button>
            )}
          </FormGroup>
        </Stack>
      )}

      <Stack space={2}>
        <Text tag='h1' size='xl' weight='semibold'>Further actions:</Text>

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
