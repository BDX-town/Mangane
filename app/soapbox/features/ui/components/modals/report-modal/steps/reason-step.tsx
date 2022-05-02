import classNames from 'classnames';
import { Set as ImmutableSet } from 'immutable';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changeReportComment, changeReportRule } from 'soapbox/actions/reports';
import { fetchRules } from 'soapbox/actions/rules';
import AttachmentThumbs from 'soapbox/components/attachment_thumbs';
import StatusContent from 'soapbox/components/status_content';
import { FormGroup, Stack, Text, Textarea } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppSelector } from 'soapbox/hooks';

import type { ReducerAccount } from 'soapbox/reducers/accounts';

const messages = defineMessages({
  placeholder: { id: 'report.placeholder', defaultMessage: 'Additional comments' },
});

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

interface IReasonStep {
  account: ReducerAccount
}

const ReasonStep = (_props: IReasonStep) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const rulesListRef = useRef(null);

  const [isNearBottom, setNearBottom] = useState<boolean>(false);
  const [isNearTop, setNearTop] = useState<boolean>(true);

  const selectedStatusIds = useAppSelector((state) => state.reports.getIn(['new', 'status_ids']) as ImmutableSet<string>);
  const comment = useAppSelector((state) => state.reports.getIn(['new', 'comment']) as string);
  const rules = useAppSelector((state) => state.rules.items);
  const ruleId = useAppSelector((state) => state.reports.getIn(['new', 'rule_id']) as boolean);
  const shouldRequireRule = rules.length > 0;

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

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(changeReportComment(event.target.value));
  };

  const handleRulesScrolling = () => {
    if (rulesListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = rulesListRef.current;

      if (scrollTop + clientHeight > scrollHeight - 24) {
        setNearBottom(true);
      } else {
        setNearBottom(false);
      }

      if (scrollTop < 24) {
        setNearTop(true);
      } else {
        setNearTop(false);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchRules());
  }, []);

  return (
    <Stack space={4}>
      {renderSelectedStatuses()}

      {shouldRequireRule && (
        <Stack space={2}>
          <Text size='xl' weight='semibold'>Reason for reporting</Text>

          <div className='relative'>
            <div
              className='bg-white rounded-lg -space-y-px max-h-96 overflow-y-auto'
              onScroll={handleRulesScrolling}
              ref={rulesListRef}
            >
              {rules.map((rule, idx) => {
                const isSelected = String(ruleId) === rule.id;

                return (
                  <button
                    key={idx}
                    data-testid={`rule-${rule.id}`}
                    onClick={() => dispatch(changeReportRule(rule.id))}
                    className={classNames({
                      'relative border border-solid border-gray-200 hover:bg-gray-50 text-left w-full p-4 flex justify-between items-center cursor-pointer': true,
                      'rounded-tl-lg rounded-tr-lg': idx === 0,
                      'rounded-bl-lg rounded-br-lg': idx === rules.length - 1,
                      'bg-gray-50': isSelected,
                    })}
                  >
                    <div className='mr-3 flex flex-col'>
                      <span
                        className={classNames('block text-sm font-medium', {
                          'text-primary-800': isSelected,
                          'text-gray-800': !isSelected,
                        })}
                      >
                        {rule.text}
                      </span>
                      <Text theme='muted' size='sm'>{rule.subtext}</Text>
                    </div>

                    <input
                      name='reason'
                      type='radio'
                      value={rule.id}
                      checked={isSelected}
                      readOnly
                      className='h-4 w-4 mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500'
                    />
                  </button>
                );
              })}
            </div>

            <div
              className={classNames('inset-x-0 top-0 flex justify-center bg-gradient-to-b from-white pb-12 pt-8 pointer-events-none dark:from-slate-900 absolute transition-opacity duration-500', {
                'opacity-0': isNearTop,
                'opacity-100': !isNearTop,
              })}
            />
            <div
              className={classNames('inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-12 pb-8 pointer-events-none dark:from-slate-900 absolute transition-opacity duration-500', {
                'opacity-0': isNearBottom,
                'opacity-100': !isNearBottom,
              })}
            />
          </div>
        </Stack>
      )}

      <FormGroup labelText={intl.formatMessage(messages.placeholder)}>
        <Textarea
          placeholder={intl.formatMessage(messages.placeholder)}
          value={comment}
          onChange={handleCommentChange}
        />
      </FormGroup>
    </Stack>
  );
};

export default ReasonStep;
