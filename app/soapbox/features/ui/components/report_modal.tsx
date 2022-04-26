import { OrderedSet } from 'immutable';
import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import Toggle from 'react-toggle';

import { blockAccount } from 'soapbox/actions/accounts';
import { changeReportComment, changeReportForward, changeReportBlock, submitReport } from 'soapbox/actions/reports';
import { expandAccountTimeline } from 'soapbox/actions/timelines';
import { Button, Modal } from 'soapbox/components/ui';
import { useAccount, useAppSelector, useFeatures } from 'soapbox/hooks';
import { isRemote, getDomain } from 'soapbox/utils/accounts';

import StatusCheckBox from '../../report/containers/status_check_box_container';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  placeholder: { id: 'report.placeholder', defaultMessage: 'Additional comments' },
  submit: { id: 'report.submit', defaultMessage: 'Submit' },
});

interface IReportModal {
  onClose: () => void
}

const ReportModal = ({ onClose }: IReportModal) => {
  const dispatch = useDispatch();
  const features = useFeatures();
  const intl = useIntl();

  const accountId = useAppSelector((state) => state.reports.getIn(['new', 'account_id']) as string);
  const account = useAccount(accountId);

  const isBlocked = useAppSelector((state) => state.reports.getIn(['new', 'block']) as boolean);
  const isSubmitting = useAppSelector((state) => state.reports.getIn(['new', 'isSubmitting']) as boolean);
  const isForward = useAppSelector((state) => state.reports.getIn(['reports', 'forward']) as boolean);
  const comment = useAppSelector((state) => state.reports.getIn(['new', 'comment']) as string);
  const statusIds = useAppSelector((state) => OrderedSet(state.timelines.getIn([`account:${accountId}:with_replies`, 'items'])).union(state.reports.getIn(['new', 'status_ids']) as Iterable<unknown>) as OrderedSet<string>);
  const canForward = isRemote(account as any) && features.federating;

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(changeReportComment(event.target.value));
  };

  const handleForwardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportForward(event.target.checked));
  };

  const handleBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportBlock(event.target.checked));
  };

  const handleSubmit = () => {
    dispatch(submitReport());

    if (isBlocked && account) {
      dispatch(blockAccount(account.id));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (account) {
      dispatch(expandAccountTimeline(account.id, { withReplies: true, maxId: null }));
    }
  }, [account]);

  if (!account) {
    return null;
  }

  return (
    <Modal
      title={<FormattedMessage id='report.target' defaultMessage='Reporting {target}' values={{ target: <strong>@{account.acct}</strong> }} />}
      onClose={onClose}
    >
      <div className='report-modal__container'>
        <div className='report-modal__comment'>
          <p><FormattedMessage id='report.hint' defaultMessage='The report will be sent to your server moderators. You can provide an explanation of why you are reporting this account below:' /></p>

          <textarea
            className='setting-text light'
            placeholder={intl.formatMessage(messages.placeholder)}
            value={comment}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            autoFocus
          />

          {canForward && (
            <div>
              <p><FormattedMessage id='report.forward_hint' defaultMessage='The account is from another server. Send a copy of the report there as well?' /></p>

              <div className='setting-toggle'>
                <Toggle id='report-forward' checked={isForward} disabled={isSubmitting} onChange={handleForwardChange} />
                <label htmlFor='report-forward' className='setting-toggle__label'><FormattedMessage id='report.forward' defaultMessage='Forward to {target}' values={{ target: getDomain(account) }} /></label>
              </div>
            </div>
          )}

          <div>
            <p><FormattedMessage id='report.block_hint' defaultMessage='Do you also want to block this account?' /></p>

            <div className='setting-toggle'>
              <Toggle id='report-block' checked={isBlocked} disabled={isSubmitting} onChange={handleBlockChange} />
              <label htmlFor='report-block' className='setting-toggle__label'><FormattedMessage id='report.block' defaultMessage='Block {target}' values={{ target: account.get('acct') }} /></label>
            </div>
          </div>

          <Button disabled={isSubmitting} onClick={handleSubmit}>{intl.formatMessage(messages.submit)}</Button>
        </div>

        <div className='report-modal__statuses'>
          <div>
            {statusIds.map((statusId) => <StatusCheckBox id={statusId} key={statusId} disabled={isSubmitting} />)}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
