import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { blockAccount } from 'soapbox/actions/accounts';
import { submitReport, submitReportSuccess, submitReportFail } from 'soapbox/actions/reports';
import { expandAccountTimeline } from 'soapbox/actions/timelines';
import AttachmentThumbs from 'soapbox/components/attachment-thumbs';
import StatusContent from 'soapbox/components/status_content';
import { Modal, ProgressBar, Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAccount, useAppDispatch, useAppSelector } from 'soapbox/hooks';

import ConfirmationStep from './steps/confirmation-step';
import OtherActionsStep from './steps/other-actions-step';
import ReasonStep from './steps/reason-step';

import type { AxiosError } from 'axios';

const messages = defineMessages({
  blankslate: { id: 'report.reason.blankslate', defaultMessage: 'You have removed all statuses from being selected.' },
  done: { id: 'report.done', defaultMessage: 'Done' },
  next: { id: 'report.next', defaultMessage: 'Next' },
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  placeholder: { id: 'report.placeholder', defaultMessage: 'Additional comments' },
  submit: { id: 'report.submit', defaultMessage: 'Submit' },
});

enum Steps {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
}

const reportSteps = {
  ONE: ReasonStep,
  TWO: OtherActionsStep,
  THREE: ConfirmationStep,
};

const SelectedStatus = ({ statusId }: { statusId: string }) => {
  const status = useAppSelector((state) => state.statuses.get(statusId));

  if (!status) {
    return null;
  }

  return (
    <Stack space={2} className='p-4 rounded-lg bg-gray-100 dark:bg-gray-800'>
      <AccountContainer
        id={status.account as any}
        showProfileHoverCard={false}
        withLinkToProfile={false}
        timestamp={status.created_at}
        hideActions
      />

      <StatusContent
        status={status}
        expanded
        collapsable
      />

      {status.media_attachments.size > 0 && (
        <AttachmentThumbs
          media={status.media_attachments}
          sensitive={status.sensitive}
        />
      )}
    </Stack>
  );
};

interface IReportModal {
  onClose: () => void
}

const ReportModal = ({ onClose }: IReportModal) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const accountId = useAppSelector((state) => state.reports.new.account_id);
  const account = useAccount(accountId as string);

  const isBlocked = useAppSelector((state) => state.reports.new.block);
  const isSubmitting = useAppSelector((state) => state.reports.new.isSubmitting);
  const rules = useAppSelector((state) => state.rules.items);
  const ruleIds = useAppSelector((state) => state.reports.new.rule_ids);
  const selectedStatusIds = useAppSelector((state) => state.reports.new.status_ids);

  const isReportingAccount = useMemo(() => selectedStatusIds.size === 0, []);
  const shouldRequireRule = rules.length > 0;

  const [currentStep, setCurrentStep] = useState<Steps>(Steps.ONE);

  const handleSubmit = () => {
    dispatch(submitReport())
      .then(() => setCurrentStep(Steps.THREE))
      .catch((error: AxiosError) => dispatch(submitReportFail(error)));

    if (isBlocked && account) {
      dispatch(blockAccount(account.id));
    }
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case Steps.ONE:
        setCurrentStep(Steps.TWO);
        break;
      case Steps.TWO:
        handleSubmit();
        break;
      case Steps.THREE:
        dispatch(submitReportSuccess());
        onClose();
        break;
      default:
        break;
    }
  };

  const renderSelectedStatuses = useCallback(() => {
    switch (selectedStatusIds.size) {
      case 0:
        return (
          <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-center w-full'>
            <Text theme='muted'>{intl.formatMessage(messages.blankslate)}</Text>
          </div>
        );
      default:
        return <SelectedStatus statusId={selectedStatusIds.first()} />;
    }
  }, [selectedStatusIds.size]);

  const confirmationText = useMemo(() => {
    switch (currentStep) {
      case Steps.TWO:
        return intl.formatMessage(messages.submit);
      case Steps.THREE:
        return intl.formatMessage(messages.done);
      default:
        return intl.formatMessage(messages.next);
    }
  }, [currentStep]);

  const isConfirmationButtonDisabled = useMemo(() => {
    if (currentStep === Steps.THREE) {
      return false;
    }

    return isSubmitting || (shouldRequireRule && ruleIds.isEmpty()) || (!isReportingAccount && selectedStatusIds.size === 0);
  }, [currentStep, isSubmitting, shouldRequireRule, ruleIds, selectedStatusIds.size, isReportingAccount]);

  const calculateProgress = useCallback(() => {
    switch (currentStep) {
      case Steps.ONE:
        return 0.33;
      case Steps.TWO:
        return 0.66;
      case Steps.THREE:
        return 1;
      default:
        return 0;
    }
  }, [currentStep]);

  useEffect(() => {
    if (account) {
      dispatch(expandAccountTimeline(account.id, { withReplies: true, maxId: null }));
    }
  }, [account]);

  if (!account) {
    return null;
  }

  const StepToRender = reportSteps[currentStep];

  return (
    <Modal
      title={<FormattedMessage id='report.target' defaultMessage='Reporting {target}' values={{ target: <strong>@{account.acct}</strong> }} />}
      onClose={onClose}
      cancelAction={currentStep === Steps.THREE ? undefined : onClose}
      confirmationAction={handleNextStep}
      confirmationText={confirmationText}
      confirmationDisabled={isConfirmationButtonDisabled}
      skipFocus
    >
      <Stack space={4}>
        <ProgressBar progress={calculateProgress()} />

        {(currentStep !== Steps.THREE && !isReportingAccount) && renderSelectedStatuses()}

        <StepToRender account={account} />
      </Stack>
    </Modal>
  );
};

export default ReportModal;
