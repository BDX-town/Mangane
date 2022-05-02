import { AxiosError } from 'axios';
import { Set as ImmutableSet } from 'immutable';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { blockAccount } from 'soapbox/actions/accounts';
import { submitReport, cancelReport, submitReportSuccess, submitReportFail } from 'soapbox/actions/reports';
import { expandAccountTimeline } from 'soapbox/actions/timelines';
import { Modal, ProgressBar, Stack } from 'soapbox/components/ui';
import { useAccount, useAppDispatch, useAppSelector } from 'soapbox/hooks';

import ConfirmationStep from './steps/confirmation-step';
import OtherActionsStep from './steps/other-actions-step';
import ReasonStep from './steps/reason-step';

const messages = defineMessages({
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

interface IReportModal {
  onClose: () => void
}

const ReportModal = ({ onClose }: IReportModal) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const accountId = useAppSelector((state) => state.reports.getIn(['new', 'account_id']) as string);
  const account = useAccount(accountId);

  const isBlocked = useAppSelector((state) => state.reports.getIn(['new', 'block']) as boolean);
  const isSubmitting = useAppSelector((state) => state.reports.getIn(['new', 'isSubmitting']) as boolean);
  const rules = useAppSelector((state) => state.rules.items);
  const ruleId = useAppSelector((state) => state.reports.getIn(['new', 'rule_id']) as string);
  const selectedStatusIds = useAppSelector((state) => state.reports.getIn(['new', 'status_ids']) as ImmutableSet<string>);

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

  const handleClose = () => {
    dispatch(cancelReport());
    onClose();
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

  const confirmationText = useMemo(() => {
    switch (currentStep) {
    case Steps.TWO:
      return intl.formatMessage(messages.submit);
    case Steps.THREE:
      return 'Done';
    default:
      return 'Next';
    }
  }, [currentStep]);

  const isConfirmationButtonDisabled = useMemo(() => {
    if (currentStep === Steps.THREE) {
      return false;
    }

    return isSubmitting || (shouldRequireRule && !ruleId) || selectedStatusIds.size === 0;
  }, [currentStep, isSubmitting, shouldRequireRule, ruleId, selectedStatusIds.size]);

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
      onClose={handleClose}
      cancelAction={currentStep === Steps.THREE ? undefined : onClose}
      confirmationAction={handleNextStep}
      confirmationText={confirmationText}
      confirmationDisabled={isConfirmationButtonDisabled}
      skipFocus
    >
      <Stack space={4}>
        <ProgressBar progress={calculateProgress()} />

        <StepToRender account={account} />
      </Stack>
    </Modal>
  );
};

export default ReportModal;
